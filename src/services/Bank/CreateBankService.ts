import prismaClient from "../../prisma";

interface BankRequest {
  name: string;
  club_id: string;
  balance: number;
}

class CreateBankService {
  async execute({ name, balance, club_id }: BankRequest) {
    if (!name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const getBank = await prismaClient.bank.findFirst({
      where: {
        name: name,
        club_id: club_id,
      },
    });

    if (getBank) {
      throw new Error("Banco já cadastrado com esse nome");
    }

    const bank = await prismaClient.bank.create({
      data: {
        name: name,
        balance: balance || 0,
        club_id: club_id,
      },
    });

    return bank;
  }
}

export { CreateBankService };
