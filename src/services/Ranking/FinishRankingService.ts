import prismaClient from "../../prisma";

interface RankingRequest {
  club_id: string;
  ranking_id: string;
}

class FinishRankingService {
  async execute({ ranking_id, club_id }: RankingRequest) {
    if (!ranking_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const ranking = await prismaClient.ranking.findFirst({
      where: {
        id: ranking_id,
        club_id: club_id,
      },
    });

    if (!ranking) {
      throw new Error("Ranking não encontrado");
    }

    if (ranking.status != "andamento") {
      throw new Error("Ranking já iniciado encontrado");
    }

    const rankingEdit = await prismaClient.ranking.update({
      where: {
        id: ranking_id,
      },
      data: {
        status: "encerrado",
      },
    });

    return rankingEdit;
  }
}

export { FinishRankingService };
