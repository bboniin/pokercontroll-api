import prismaClient from "../../prisma";

interface TournamentRequest {
  client_id: string;
  club_id: string;
  tournament_id: string;
}

class ReturnClientTournamentService {
  async execute({ client_id, club_id, tournament_id }: TournamentRequest) {
    if (!client_id || !tournament_id) {
      throw new Error("Id do cliente e do torneio são obrigatórios");
    }

    const tournamentGet = await prismaClient.tournament.findFirst({
      where: {
        id: tournament_id,
        club_id: club_id,
      },
      include: {
        clients: true,
      },
    });

    if (!tournamentGet) {
      throw new Error("Torneio não foi encontrado");
    }

    if (tournamentGet.status == "encerrado") {
      throw new Error("Torneio já foi encerrado");
    }

    const chairClient = await prismaClient.clientTournament.findFirst({
      where: {
        client_id: client_id,
        tournament_id: tournament_id,
        exit: true,
      },
    });

    if (!chairClient) {
      throw new Error("Cliente não foi encontrado");
    }

    await prismaClient.clientTournament.update({
      where: {
        id: chairClient.id,
      },
      data: {
        date_out: new Date(),
        exit: false,
        position: 9999,
        chair_tournament: "",
      },
    });

    const tournament = await prismaClient.tournament.findUnique({
      where: {
        id: tournament_id,
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

export { ReturnClientTournamentService };
