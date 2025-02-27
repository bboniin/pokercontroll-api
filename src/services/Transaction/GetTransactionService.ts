import prismaClient from "../../prisma";

interface TransactionRequest {
  id: string;
}

class GetTransactionService {
  async execute({ id }: TransactionRequest) {
    if (!id) {
      throw new Error("id da cobrança é obrigatório");
    }

    const transaction = await prismaClient.transaction.findFirst({
      where: {
        id: id,
      },
    });

    if (!transaction) {
      throw new Error("Transação não encontrada");
    }
    return transaction;
  }
}

export { GetTransactionService };
