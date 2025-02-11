import prismaClient from "../../prisma";

interface RankingRequest {
  ranking_id: string;
  club_id: string;
}

class DeleteRankingService {
  async execute({ ranking_id, club_id }: RankingRequest) {
    const ranking = await prismaClient.ranking.findFirst({
      where: {
        id: ranking_id,
        club_id: club_id,
      },
    });

    if (!ranking) {
      throw new Error("Ranking não encontrado");
    }

    await prismaClient.ranking.delete({
      where: {
        id: ranking_id,
      },
    });

    return ranking;
  }
}

export { DeleteRankingService };
