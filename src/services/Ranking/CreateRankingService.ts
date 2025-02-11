import prismaClient from "../../prisma";

interface RankingRequest {
  name: string;
  description: string;
  goal_value: number;
  club_id: string;
}

class CreateRankingService {
  async execute({ club_id, name, goal_value, description }: RankingRequest) {
    if (!name || !description || !goal_value || !club_id) {
      throw new Error("Nome, descrição e meta são obrigatórios");
    }

    const ranking = await prismaClient.ranking.create({
      data: {
        name: name,
        description: description,
        club_id: club_id,
        goal_value: goal_value,
        status: "criado",
      },
    });

    return ranking;
  }
}

export { CreateRankingService };
