import prismaClient from "../../prisma";

interface BankRequest {
  bank_id: string;
  club_id: string;
}

class DeleteBankService {
  async execute({ bank_id, club_id }: BankRequest) {
    const getBank = await prismaClient.bank.findFirst({
      where: {
        id: bank_id,
        club_id: club_id,
      },
    });

    if (!getBank) {
      throw new Error("Banco não encontrado");
    }

    const bank = await prismaClient.bank.delete({
      where: {
        id: bank_id,
      },
    });

    return bank;
  }
}

export { DeleteBankService };
