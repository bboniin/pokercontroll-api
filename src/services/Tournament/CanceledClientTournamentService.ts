import { addMonths } from "date-fns";
import prismaClient from "../../prisma";

interface TournamentRequest {
  client_id: string;
  tournament_id: string;
  transactions: Array<string>;
  club_id: string;
  user_id: string;
}

class CanceledClientTournamentService {
  async execute({
    client_id,
    tournament_id,
    transactions,
    club_id,
    user_id,
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
        exit: false,
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

    let errorDeleted = false;

    Promise.all(
      await transactionsTournament.map(async (item) => {
        if (transactions.some((data) => data == item.id)) {
          item.items_transaction.map((item) => {
            if (
              item.type == "entrie" &&
              transactions.length != transactionsTournament.length
            ) {
              errorDeleted = true;
            }
          });
        }
      })
    );

    if (errorDeleted) {
      throw new Error("Se excluir a entrada, deverá excluir todas as compras");
    }

    let valueCredit = 0;
    let valueBalance = 0;
    let valueAccumulated = 0;
    let totalPaidClub = 0;
    let totalPaidDealer = 0;
    let totalPaidPassport = 0;
    let totalPaidJackpot = 0;

    let methods = {};

    let tokens =
      transactionsTournament.length == transactions.length
        ? chairClient.timechip || 0
        : 0;

    Promise.all(
      await transactionsTournament.map(async (item) => {
        if (transactions.some((data) => data == item.id)) {
          let valuePaid = 0;
          let amount = 0;
          let product_id = "";
          valueCredit += item.value - item.value_paid;
          item.items_transaction.map((data) => {
            product_id = data.product_id;
            if (data.type == "entrie" || data.type == "purchase") {
              valueAccumulated += data.value;
            }
            amount = data.amount;
          });
          item.methods_transaction.map((data) => {
            if (data.method_id) {
              if (methods[data.method_id]) {
                methods[data.method_id].value +=
                  data.value * ((100 - data.percentage) / 100);
              } else {
                methods[data.id] = {
                  value: data.value * ((100 - data.percentage) / 100),
                  id: data.method_id,
                };
              }
            }

            if (data.name == "Saldo") {
              valueBalance += data.value;
              valuePaid += data.value;
            } else {
              valuePaid += data.value * ((100 - data.percentage) / 100);
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
              amount: amount,
              OR: [
                {
                  purchase_id: product_id,
                },
                {
                  identifier: product_id,
                },
              ],
              tournament_id: tournament_id,
            },
          });

          if (purchase) {
            if (purchase.type == "staff") {
              const purchaseTournament = tournamentGet.purchases.find(
                (item) => purchase.purchase_id === item.id
              );
              if (purchaseTournament) {
                tokens += purchase.amount * purchaseTournament.token_staff;
              }
            } else {
              if (purchase.type != "service") {
                const purchaseTournament = tournamentGet.purchases.find(
                  (item) => purchase.purchase_id === item.id
                );
                if (purchaseTournament) {
                  tokens += purchase.amount * purchaseTournament.token;
                }
              }
            }
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
          user_id: user_id,
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

    if (transactionsTournament.length == transactions.length) {
      await prismaClient.clientTournament.delete({
        where: {
          id: chairClient.id,
        },
      });
    }

    Promise.all(
      await Object.values(methods).map(async (item) => {
        const method = await prismaClient.method.findUnique({
          where: {
            id: item["id"],
          },
        });

        if (method) {
          await prismaClient.method.update({
            where: {
              id: method.id,
            },
            data: {
              balance: method.balance - item["value"] || 0,
            },
          });
        }
      })
    );

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
