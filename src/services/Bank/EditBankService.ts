import prismaClient from "../../prisma";

interface BankRequest {
  name: string;
  club_id: string;
  balance: number;
  bank_id: string;
}

class EditBankService {
  async execute({ name, balance, club_id, bank_id }: BankRequest) {
    if (!name || !bank_id) {
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

    const bank = await prismaClient.bank.update({
      where: {
        id: bank_id,
      },
      data: {
        name: name,
        balance: balance || 0,
        club_id: club_id,
      },
    });

    return bank;
  }
}

export { EditBankService };
