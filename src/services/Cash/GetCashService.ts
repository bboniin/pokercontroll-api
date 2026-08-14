import prismaClient from "../../prisma";

interface CashRequest {
  club_id: string;
  cash_id: string;
}

class GetCashService {
  async execute({ club_id, cash_id }: CashRequest) {
    const cash = await prismaClient.cash.findFirst({
      where: {
        id: cash_id,
        club_id: club_id,
      },
      include: {
        rakes: true,
        boxs: true,
        jackpots: true,
      },
    });

    if (!cash) {
      throw new Error("Sessão cash não encontrada");
    }

    const transactions = await prismaClient.transaction.findMany({
      where: {
        sector_id: cash.id,
      },
      include: {
        client: true,
        methods_transaction: true,
        historics_transaction: {
          orderBy: {
            create_at: "desc",
          },
        },
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
      { total_entrie: 0, total_out: 0 },
    );

    const rake = cash.rakes.reduce((acc, item) => acc + item.value, 0);
    const caixinha = cash.boxs.reduce((acc, item) => acc + item.value, 0);
    const jackpot = cash.jackpots.reduce((acc, item) => acc + item.value, 0);

    cash["transactions"] = transactions;
    cash["total_entrie"] = total_entrie;
    cash["total_out"] = total_out;
    cash["rake"] = rake;
    cash["caixinha"] = caixinha;
    cash["jackpot"] = jackpot;

    return cash;
  }
}

export { GetCashService };
