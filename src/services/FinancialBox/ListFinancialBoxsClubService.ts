import prismaClient from "../../prisma";

interface BoxRequest {
  club_id: string;
  page: number;
  all: boolean;
  user_id: string;
  admin_id: string;
}

class ListFinancialBoxsClubService {
  async execute({ club_id, page, all, user_id, admin_id }: BoxRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    const admin = await prismaClient.user.findFirst({
      where: {
        id: admin_id,
        type: "admin",
      },
    });

    if (!admin) {
      throw new Error("Rota restrira para administrador");
    }

    const financialBoxsTotal = await prismaClient.financialBox.count({
      where: {
        club_id: club_id,
        ...(user_id && { user_id: user_id }),
      },
    });

    const financialBoxs = await prismaClient.financialBox.findMany({
      ...filter,
      where: {
        ...(user_id && { user_id: user_id }),
      },
      orderBy: {
        date_end: "desc",
      },
      include: {
        user: true,
      },
    });

    return { financialBoxs, financialBoxsTotal };
  }
}

export { ListFinancialBoxsClubService };
