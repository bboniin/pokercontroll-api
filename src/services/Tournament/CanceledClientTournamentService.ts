import { addMonths } from "date-fns";
import prismaClient from "../../prisma";

interface TournamentRequest {
  client_id: string;
  tournament_id: string;
}

class CanceledClientTournamentService {
  async execute({ client_id, tournament_id }: TournamentRequest) {
    if (!client_id || !tournament_id) {
      throw new Error("Id do cliente e do torneio são obrigatórios");
    }

    const tournamentGet = await prismaClient.tournament.findUnique({
      where: {
        id: tournament_id,
      },
      include: {
        clients: true,
        club: true,
        purchases: true,
      },
    });

    if (!tournamentGet) {
      throw new Error("Torneio não foi encontrado");
    }

    if (
      tournamentGet.status != "aberto" &&
      tournamentGet.status != "inscricao"
    ) {
      throw new Error("Não é mais permitido cancelar compras do cliente");
    }

    const chairClient = await prismaClient.clientTournament.findFirst({
      where: {
        client_id: client_id,
        tournament_id: tournament_id,
        chair_tournament: {
          contains: "T",
        },
      },
      include: {
        purchases: true,
        client: true,
      },
    });

    if (!chairClient) {
      throw new Error("Cliente não foi encontrado");
    }

    const transactions = await prismaClient.transaction.findMany({
      where: {
        client_id: client_id,
        sector_id: tournamentGet.id,
        operation: "entrada",
      },
    });

    let valueCredit = 0;
    let valuePaid = 0;
    let valueCreditClub = 0;
    let totalPaidClub = 0;
    let totalPaidDealer = 0;
    let totalPaidPassport = 0;
    let totalPaidJackpot = 0;

    Promise.all(
      await transactions.map(async (item) => {
        valuePaid += item.value_paid;
        valueCredit += item.value - item.value_paid;
        switch (item.type) {
          case "dealer": {
            totalPaidDealer += item.value;
            break;
          }
          case "jackpot": {
            totalPaidJackpot += item.value;
            break;
          }
          case "passport": {
            totalPaidPassport += item.value;
            break;
          }
          default: {
            totalPaidClub += item.value;
            valueCreditClub += item.value - item.value_paid;
          }
        }

        await prismaClient.transaction.delete({
          where: {
            id: item.id,
          },
        });
      })
    );

    if (valuePaid) {
      const transaction = await prismaClient.transaction.create({
        data: {
          type: "clube",
          value: valuePaid,
          club_id: tournamentGet.club.id,
          client_id: client_id,
          operation: "saida",
          date_payment: addMonths(new Date(), 1),
          observation: "",
          paid: false,
          value_paid: 0,
        },
      });

      await prismaClient.itemsTransaction.create({
        data: {
          name: "Estorno",
          value: valuePaid,
          amount: 1,
          transaction_id: transaction.id,
        },
      });
    }
    await prismaClient.client.update({
      where: {
        id: client_id,
      },
      data: {
        receive: parseFloat(
          (chairClient.client.receive + valuePaid).toFixed(2)
        ),
        debt: parseFloat((chairClient.client.debt - valueCredit).toFixed(2)),
      },
    });

    await prismaClient.club.update({
      where: {
        id: tournamentGet.club.id,
      },
      data: {
        balance: parseFloat(
          (tournamentGet.club.balance - totalPaidClub).toFixed(2)
        ),
        dealer: parseFloat(
          (tournamentGet.club.dealer - totalPaidDealer).toFixed(2)
        ),
        passport: parseFloat(
          (tournamentGet.club.passport - totalPaidPassport).toFixed(2)
        ),
        jackpot: parseFloat(
          (tournamentGet.club.jackpot - totalPaidJackpot).toFixed(2)
        ),
      },
    });

    let tokens = chairClient.timechip || 0;

    console.log(tokens, chairClient.timechip);
    Promise.all(
      await chairClient.purchases.map(async (item) => {
        if (item.type != "service") {
          const purchase = tournamentGet.purchases.find(
            (purchase) => item.purchase_id === purchase.id
          );
          tokens += item.amount * purchase.token;
        }
      })
    );

    console.log(tokens);

    const tournament = await prismaClient.tournament.update({
      where: {
        id: tournament_id,
      },
      data: {
        total_tokens: tournamentGet.total_tokens - tokens,
        totalAward_accumulated:
          tournamentGet.totalAward_accumulated -
          (valueCreditClub + totalPaidClub),
      },
      include: {
        clients: true,
        club: true,
        purchases: true,
      },
    });

    await prismaClient.clientTournament.delete({
      where: {
        id: chairClient.id,
      },
    });

    return tournament;
  }
}

export { CanceledClientTournamentService };
