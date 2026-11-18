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

    let eventIdToUpdate = tournament.event_id;

    if (tournament.type === "classificatorio" || tournament.type === "final") {
      const activeEvent = await prismaClient.event.findFirst({
        where: {
          club_id,
          status: "ativo",
        },
      });

      if (!activeEvent) {
        throw new Error(
          "Torneios do tipo classificatório e final só podem ser iniciados durante um evento ativo. Inicie um evento na Área de Eventos primeiro."
        );
      }

      eventIdToUpdate = activeEvent.id;
    }

    const tournamentC = await prismaClient.tournament.update({
      where: {
        id: tournament_id,
      },
      data: {
        status: "aberto",
        event_id: eventIdToUpdate,
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

    return tournamentC;
  }
}

export { OpenTournamentService };
