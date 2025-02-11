import prismaClient from "../../prisma";

interface RankingRequest {
  club_id: string;
  page: number;
  all: boolean;
}

class ListRankingsService {
  async execute({ club_id, page, all }: RankingRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    const rankingsTotal = await prismaClient.ranking.count({
      where: {
        club_id: club_id,
      },
    });

    const rankings = await prismaClient.ranking.findMany({
      ...filter,
      where: {
        club_id: club_id,
      },
      orderBy: {
        create_at: "asc",
      },
      include: {
        clients_points: true,
        tournaments: true,
      },
    });

    rankings.map((data) => {
      data["accumulated_value"] = data.tournaments.reduce(
        (acc, item) => acc + item.value,
        0
      );
    });

    return { rankings, rankingsTotal };
  }
}

export { ListRankingsService };
