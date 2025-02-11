import prismaClient from "../../prisma";

interface TournamentRequest {
  client_id: string;
  chair: string;
  tournament_id: string;
}

class AddTournamentService {
  async execute({ client_id, chair, tournament_id }: TournamentRequest) {
    if (!client_id || !chair || !tournament_id) {
      throw new Error(
        "Id do cliente, do torneio e posição da mesa é obrigatório"
      );
    }

    const chairClient = await prismaClient.clientTournament.findFirst({
      where: {
        tournament_id: tournament_id,
        chair_tournament: "T" + chair,
        exit: false,
      },
    });

    const clientTournamentGet = await prismaClient.clientTournament.findFirst({
      where: {
        client_id: client_id,
        tournament_id: tournament_id,
      },
    });

    if (chairClient) {
      throw new Error("Posição já está sendo ocupada");
    }

    if (clientTournamentGet) {
      if (clientTournamentGet.exit) {
        const client = await prismaClient.clientTournament.update({
          where: {
            id: clientTournamentGet.id,
          },
          data: {
            client_id: client_id,
            tournament_id: tournament_id,
            date_in: new Date(),
            award: 0,
            chair_tournament: "T" + chair,
            exit: false,
          },
        });

        return client;
      } else {
        throw new Error("Cliente já está participando desse torneio");
      }
    } else {
      const client = await prismaClient.clientTournament.create({
        data: {
          client_id: client_id,
          tournament_id: tournament_id,
          date_in: new Date(),
          award: 0,
          chair_tournament: "T" + chair,
        },
      });

      return client;
    }
  }
}

export { AddTournamentService };
