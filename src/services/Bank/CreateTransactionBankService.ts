import prismaClient from "../../prisma";

interface BankRequest {
  name: string;
  club_id: string;
  value: number;
  operation: string;
  observation: string;
  bank_id: string;
}

class CreateTransactionBankService {
  async execute({
    name,
    bank_id,
    observation,
    operation,
    value,
    club_id,
  }: BankRequest) {
    if (!name || !club_id || !bank_id || !operation || !value) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const getBank = await prismaClient.bank.findFirst({
      where: {
        id: bank_id,
        club_id: club_id,
      },
    });

    if (!getBank) {
      throw new Error("Banco não encontrado");
    }

    const transaction = await prismaClient.transactionBank.create({
      data: {
        name: name,
        value: value,
        operation: operation == "entrada" ? "entrada" : "saida",
        bank_id: bank_id,
        observation: observation,
      },
    });

    if (operation == "entrada") {
      await prismaClient.bank.update({
        where: {
          id: bank_id,
        },
        data: {
          balance: getBank.balance + value,
        },
      });
    } else {
      await prismaClient.bank.update({
        where: {
          id: bank_id,
        },
        data: {
          balance: getBank.balance - value,
        },
      });
    }

    return transaction;
  }
}

export { CreateTransactionBankService };
