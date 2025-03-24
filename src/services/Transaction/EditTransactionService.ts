import prismaClient from "../../prisma";

interface TransactionRequest {
  club_id: string;
  id: string;
  observation: string;
  value: number;
}

class EditTransactionService {
  async execute({ id, club_id, observation, value }: TransactionRequest) {
    if (!id) {
      throw new Error("Id da transação é obrigatório");
    }

    const getTransaction = await prismaClient.transaction.findFirst({
      where: {
        id: id,
        club_id: club_id,
      },
    });

    if (!getTransaction) {
      throw new Error("Essa cobrança não existe");
    }

    if (getTransaction.editable && !value) {
      throw new Error("Valor é obrigatório");
    }

    const transaction = await prismaClient.transaction.update({
      where: {
        id: id,
      },
      data: {
        observation: observation,
        value: getTransaction.editable ? value : getTransaction.value,
        items_transaction: {
          updateMany: {
            where: {
              value: getTransaction.value,
            },
            data: {
              value: getTransaction.editable ? value : getTransaction.value,
            },
          },
        },
      },
    });

    return transaction;
  }
}

export { EditTransactionService };
