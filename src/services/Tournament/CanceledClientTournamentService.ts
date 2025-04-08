import { addMonths } from "date-fns";
import prismaClient from "../../prisma";

interface TournamentRequest {
  client_id: string;
  tournament_id: string;
  transactions: Array<string>;
  club_id: string;
}

class CanceledClientTournamentService {
  async execute({
    client_id,
    tournament_id,
    transactions,
    club_id,
  }: TournamentRequest) {
    if (!client_id || !tournament_id || !transactions.length) {
      throw new Error("Id do cliente, torneio e transação são obrigatórios");
    }
    const tournamentGet = await prismaClient.tournament.findFirst({
      where: {
        id: tournament_id,
        club_id: club_id,
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

    const transactionsTournament = await prismaClient.transaction.findMany({
      where: {
        client_id: client_id,
        sector_id: tournamentGet.id,
        operation: "entrada",
      },
      include: {
        methods_transaction: true,
        items_transaction: true,
      },
    });

    if (!transactionsTournament) {
      throw new Error("Nenhum transação encontrada");
    }

    Promise.all(
      await transactionsTournament.map(async (item) => {
        if (transactions.some((data) => data == item.id)) {
          item.items_transaction.map((data) => {
            if (
              item.type == "entrie" &&
              transactions.length != transactionsTournament.length
            ) {
              throw new Error(
                "Se excluir a entrada, deverá excluir todas as compras"
              );
            }
          });
        }
      })
    );

    let valueCredit = 0;
    let valueBalance = 0;
    let valueAccumulated = 0;
    let totalPaidClub = 0;
    let totalPaidDealer = 0;
    let totalPaidPassport = 0;
    let totalPaidJackpot = 0;

    Promise.all(
      await transactionsTournament.map(async (item) => {
        if (transactions.some((data) => data == item.id)) {
          let valuePaid = 0;
          let product_id = "";
          item.items_transaction.map((data) => {
            product_id = data.product_id;
            if (data.type == "entrie" || data.type == "purchase") {
              valueAccumulated += data.value;
            }
          });
          item.methods_transaction.map((data) => {
            if (data.id == "Saldo") {
              valueBalance += data.value;
              valuePaid += data.value;
            } else {
              if (data.id == "Crédito") {
                valueCredit += data.value;
              } else {
                valuePaid += data.value * ((100 - data.percentage) / 100);
              }
            }
          });
          switch (item.type) {
            case "dealer": {
              totalPaidDealer += valuePaid;
              break;
            }
            case "jackpot": {
              totalPaidJackpot += valuePaid;
              break;
            }
            case "passport": {
              totalPaidPassport += valuePaid;
              break;
            }
            default: {
              totalPaidClub += valuePaid;
            }
          }

          await prismaClient.transaction.delete({
            where: {
              id: item.id,
            },
          });

          const purchase = await prismaClient.clientPurchase.findFirst({
            where: {
              client_id: chairClient.id,
              OR: [
                {
                  id: product_id,
                },
                {
                  identifier: product_id,
                },
              ],
              tournament_id: tournament_id,
            },
          });

          if (purchase) {
            await prismaClient.clientPurchase.delete({
              where: {
                id: purchase.id,
              },
            });
          }
        }
      })
    );

    await prismaClient.client.update({
      where: {
        id: client_id,
      },
      data: {
        receive: parseFloat(
          (chairClient.client.receive + valueBalance).toFixed(2)
        ),
        debt: parseFloat((chairClient.client.debt - valueCredit).toFixed(2)),
      },
    });

    if (valueBalance) {
      const transaction = await prismaClient.transaction.create({
        data: {
          type: "clube",
          value: valueBalance,
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
          name: "Estorno de Saldo",
          value: valueBalance,
          amount: 1,
          transaction_id: transaction.id,
        },
      });
    }

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

    Promise.all(
      await chairClient.purchases.map(async (item) => {
        if (item.type == "staff") {
          const purchase = tournamentGet.purchases.find(
            (purchase) => item.purchase_id === purchase.id
          );
          tokens += item.amount * purchase.token_staff;
        } else {
          if (item.type != "service") {
            const purchase = tournamentGet.purchases.find(
              (purchase) => item.purchase_id === purchase.id
            );
            tokens += item.amount * purchase.token;
          }
        }
      })
    );

    if (transactionsTournament.length == transactions.length) {
      await prismaClient.clientTournament.delete({
        where: {
          id: chairClient.id,
        },
      });
    }

    const tournament = await prismaClient.tournament.update({
      where: {
        id: tournament_id,
      },
      data: {
        total_tokens: tournamentGet.total_tokens - tokens,
        totalAward_accumulated:
          tournamentGet.totalAward_accumulated - valueAccumulated,
      },
      include: {
        clients: {
          orderBy: {
            date_out: "desc",
          },
          include: {
            client: true,
            purchases: true,
          },
        },
        purchases: true,
        clients_purchases: true,
        vacancys: {
          include: {
            client: true,
          },
        },
        rankings: true,
      },
    });

    return tournament;
  }
}

export { CanceledClientTournamentService };
