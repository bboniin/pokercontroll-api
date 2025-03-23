import prismaClient from "../../prisma";

interface PayableRequest {
  bank_id: string;
  page: number;
  all: boolean;
}

class ListTransactionsBankService {
  async execute({ bank_id, page, all }: PayableRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    const transactionsTotal = await prismaClient.transactionBank.count({
      where: {
        bank_id: bank_id,
      },
    });

    const transactions = await prismaClient.transactionBank.findMany({
      ...filter,
      where: {
        bank_id: bank_id,
      },
      orderBy: {
        create_at: "asc",
      },
    });

    return all ? transactions : { transactions, transactionsTotal };
  }
}

export { ListTransactionsBankService };
