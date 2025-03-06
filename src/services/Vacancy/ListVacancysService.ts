import prismaClient from "../../prisma";

interface vacancyRequest {
  club_id: string;
  page: number;
  name: string;
}

class ListVacancysService {
  async execute({ club_id, page, name }: vacancyRequest) {
    const vacancysTotal = await prismaClient.vacancy.count({
      where: {
        tournament: {
          club_id: club_id,
        },
        name: name,
      },
    });

    const vacancys = await prismaClient.vacancy.findMany({
      where: {
        tournament: {
          club_id: club_id,
        },
        name: name,
      },
      orderBy: {
        create_at: "desc",
      },
      include: {
        tournament: true,
        client: true,
      },
      skip: page * 30,
      take: 30,
    });

    return { vacancys, vacancysTotal };
  }
}

export { ListVacancysService };
