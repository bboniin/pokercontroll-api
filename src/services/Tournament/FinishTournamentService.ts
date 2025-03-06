import prismaClient from "../../prisma";

interface TournamentRequest {
  club_id: string;
  tournament_id: string;
}

class FinishTournamentService {
  async execute({ tournament_id, club_id }: TournamentRequest) {
    const tournament = await prismaClient.tournament.findFirst({
      where: {
        club_id: club_id,
        id: tournament_id,
      },
      include: {
        rankings: {
          include: {
            tournament_rules: true,
          },
        },
      },
    });

    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }

    const clientTournament = await prismaClient.clientTournament.findFirst({
      where: {
        exit: false,
        tournament_id: tournament_id,
      },
    });

    if (clientTournament) {
      throw new Error("Elimine todos os jogadores para finalizar o torneio");
    }

    const tournamentC = await prismaClient.tournament.update({
      where: {
        id: tournament_id,
      },
      data: {
        status: "encerrado",
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

    const clientTournaments = await prismaClient.clientTournament.findMany({
      where: {
        tournament_id: tournament_id,
      },
      orderBy: {
        update_at: "asc",
      },
    });

    let rules = [];
    tournament.rankings.map((data) => {
      data.tournament_rules.map((item) => {
        rules.push({
          min: item.min_position,
          max: item.max_position,
          points: item.points,
          ranking_id: data.ranking_id,
        });
      });
    });

    Promise.all(
      await clientTournaments.map((client, idx) => {
        const rulesClient = rules.filter(
          (r) => idx + 1 >= r.min && idx + 1 <= r.max
        );
        rulesClient.map(async (data) => {
          await prismaClient.clientPoints.create({
            data: {
              client_id: client.client_id,
              points: data.points,
              position: idx + 1,
              ranking_id: data.ranking_id,
            },
          });
        });
      })
    );

    return tournamentC;
  }
}

export { FinishTournamentService };
