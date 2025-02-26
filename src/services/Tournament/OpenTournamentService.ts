import { addMinutes } from "date-fns";
import prismaClient from "../../prisma";

interface TournamentRequest {
  club_id: string;
  tournament_id: string;
}

class OpenTournamentService {
  async execute({ tournament_id, club_id }: TournamentRequest) {
    const tournament = await prismaClient.tournament.findFirst({
      where: {
        club_id: club_id,
        id: tournament_id,
      },
    });

    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }

    const tournamentC = await prismaClient.tournament.update({
      where: {
        id: tournament_id,
      },
      data: {
        status: "aberto",
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
      },
    });

    return tournamentC;
  }
}

export { OpenTournamentService };
