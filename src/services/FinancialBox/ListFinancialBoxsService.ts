import prismaClient from "../../prisma";

interface BoxRequest {
  club_id: string;
  page: number;
  all: boolean;
  user_id: string;
}

class ListFinancialBoxsService {
  async execute({ club_id, page, all, user_id }: BoxRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
        type: "admin",
      },
    });

    if (user) {
      user_id = null;
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
        date_initial: "asc",
      },
      include: {
        user: true,
      },
    });

    return { financialBoxs, financialBoxsTotal };
  }
}

export { ListFinancialBoxsService };
