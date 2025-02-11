import prismaClient from "../../prisma";

interface RankingRequest {
  name: string;
  description: string;
  club_id: string;
  ranking_id: string;
  goal_value: number;
}

class EditRankingService {
  async execute({
    name,
    ranking_id,
    goal_value,
    description,
    club_id,
  }: RankingRequest) {
    if (!name || !ranking_id || !goal_value || !description || !club_id) {
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

    const rankingEdit = await prismaClient.ranking.update({
      where: {
        id: ranking_id,
      },
      data: {
        name: name,
        description: description,
        goal_value: goal_value,
        update_at: new Date(),
      },
    });

    return rankingEdit;
  }
}

export { EditRankingService };
