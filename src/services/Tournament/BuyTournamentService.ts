import prismaClient from "../../prisma";

interface TournamentRequest {
  totalToken: number;
  totalValue: number;
  tournament_id: string;
}

class BuyTournamentService {
  async execute({ totalToken, totalValue, tournament_id }: TournamentRequest, tx?: any) {
    const prisma = tx || prismaClient;
    const tournamentGet = await prisma.tournament.findFirst({
      where: {
        id: tournament_id,
      },
    });

    const tournament = await prisma.tournament.update({
      where: {
        id: tournamentGet["id"],
      },
      data: {
        total_tokens: tournamentGet.total_tokens + totalToken,
        totalAward_accumulated:
          tournamentGet.totalAward_accumulated + totalValue,
      },
      include: {
        clients: {
          orderBy: {
            date_out: "desc",
          },
          include: {
            client: true,
            purchases: true,
          },
        },
        purchases: true,
        clients_purchases: true,
        vacancys: {
          include: {
            client: true,
          },
        },
        rankings: true,
      },
    });

    return tournament;
  }
}

export { BuyTournamentService };
