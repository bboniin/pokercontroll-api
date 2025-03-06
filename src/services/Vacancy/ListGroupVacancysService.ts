import prismaClient from "../../prisma";

interface vacancyRequest {
  club_id: string;
}

class ListGroupVacancysService {
  async execute({ club_id }: vacancyRequest) {
    const vacancys = await prismaClient.vacancy.findMany({
      where: {
        tournament: {
          club_id: club_id,
        },
      },
      orderBy: {
        create_at: "desc",
      },
      include: {
        tournament: true,
        client: true,
      },
    });

    const groupedVacancys = vacancys.reduce((acc, vacancy) => {
      const { name } = vacancy;

      if (!acc[name]) {
        acc[name] = [];
      }

      acc[name].push(vacancy);

      return acc;
    }, {} as Record<string, typeof vacancys>);

    const groupedArray = Object.entries(groupedVacancys).map(
      ([name, vacancys]) => ({
        name,
        vacancys,
      })
    );

    return groupedArray;
  }
}

export { ListGroupVacancysService };
