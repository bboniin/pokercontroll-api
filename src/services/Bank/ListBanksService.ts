import prismaClient from "../../prisma";

interface PayableRequest {
  club_id: string;
}

class ListBanksService {
  async execute({ club_id }: PayableRequest) {
    const banks = await prismaClient.bank.findMany({
      where: {
        club_id: club_id,
      },
      orderBy: {
        create_at: "asc",
      },
    });

    return banks;
  }
}

export { ListBanksService };
