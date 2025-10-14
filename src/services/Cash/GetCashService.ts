import prismaClient from "../../prisma";

interface CashRequest {
  club_id: string;
}

class GetCashService {
  async execute({ club_id }: CashRequest) {
    const cash = await prismaClient.cash.findFirst({
      where: {
        club_id: club_id,
        closed: false,
      },
      include: {
        rakes: true,
      },
    });

    if (cash) {
      const transactions = await prismaClient.transaction.findMany({
        where: {
          sector_id: cash.id,
        },
      });
      const { total_entrie, total_out } = transactions.reduce(
        (acc, item) => {
          if (item.operation === "entrada") {
            acc.total_entrie += item.value;
          } else {
            acc.total_out += item.value;
          }
          return acc;
        },
        { total_entrie: 0, total_out: 0 }
      );

      const rake = cash.rakes.reduce((acc, item) => acc + item.value, 0);

      cash["transactions"] = transactions;
      cash["total_entrie"] = total_entrie;
      cash["total_out"] = total_out;
      cash["rake"] = rake;
    }

    return cash;
  }
}

export { GetCashService };
