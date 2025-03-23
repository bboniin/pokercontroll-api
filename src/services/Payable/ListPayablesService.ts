import prismaClient from "../../prisma";

interface PayableRequest {
  club_id: string;
  page: number;
  all: boolean;
}

class ListPayablesService {
  async execute({ club_id, page, all }: PayableRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    const payablesTotal = await prismaClient.payable.count({
      where: {
        club_id: club_id,
      },
    });

    const payables = await prismaClient.payable.findMany({
      ...filter,
      where: {
        club_id: club_id,
      },
      orderBy: {
        create_at: "asc",
      },
    });

    return all ? payables : { payables, payablesTotal };
  }
}

export { ListPayablesService };
