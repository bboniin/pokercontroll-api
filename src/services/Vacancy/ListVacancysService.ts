import prismaClient from "../../prisma";

interface vacancyRequest {
  club_id: string;
  page: number;
  all: boolean;
}

class ListVacancysService {
  async execute({ club_id, page, all }: vacancyRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    const vacancysTotal = await prismaClient.vacancy.count({
      where: {
        tournament: {
          club_id: club_id,
        },
      },
    });

    const vacancys = await prismaClient.vacancy.findMany({
      ...filter,
      where: {
        tournament: {
          club_id: club_id,
        },
      },
      orderBy: {
        create_at: "asc",
      },
      include: {
        tournament: true,
        client: true,
      },
    });

    return { vacancys, vacancysTotal };
  }
}

export { ListVacancysService };
