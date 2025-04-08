import prismaClient from "../../prisma";

interface TournamentRequest {
  type: string;
  club_id: string;
  tournament_id: string;
}

class EditTableTournamentService {
  async execute({ type, club_id, tournament_id }: TournamentRequest) {
    if (!type || !club_id || !tournament_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const tournament = await prismaClient.tournament.findFirst({
      where: {
        id: tournament_id,
        club_id: club_id,
      },
    });

    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }

    if (type == "add") {
      const tournamentEdit = await prismaClient.tournament.update({
        where: {
          id: tournament_id,
        },
        data: {
          chairs: tournament.chairs + 1,
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

      return tournamentEdit;
    } else {
      const clients = await prismaClient.clientTournament.findMany({
        where: {
          tournament_id: tournament.id,
          chair_tournament: {
            startsWith: `T${tournament.chairs}`,
          },
        },
      });
      if (!clients) {
        throw new Error("Retire todos os jogadores da mesa para excluir");
      }
      const tournamentEdit = await prismaClient.tournament.update({
        where: {
          id: tournament_id,
        },
        data: {
          chairs: tournament.chairs - 1,
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

      return tournamentEdit;
    }
  }
}

export { EditTableTournamentService };
