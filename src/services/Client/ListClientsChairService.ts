import prismaClient from "../../prisma";

interface ClientRequest {
  club_id: string;
  tournament_id: string;
  cash_id: string;
}

class ListClientsChairService {
  async execute({ club_id, cash_id, tournament_id }: ClientRequest) {
    let filter = {
      club_id: club_id,
      visible: true,
    };

    if (!tournament_id && !cash_id) {
      throw new Error("Envie o torneio ou a sessão cash");
    }

    if (tournament_id) {
      filter["OR"] = [
        {
          client_tournaments: {
            none: {
              tournament_id: tournament_id,
            },
          },
        },
        {
          client_tournaments: {
            some: {
              tournament_id: tournament_id,
              exit: true,
            },
          },
        },
      ];
    } else {
      filter["OR"] = [
        {
          client_cashs: {
            none: {
              cash_id: cash_id,
            },
          },
        },
        {
          client_cashs: {
            some: {
              cash_id: cash_id,
              exit: true,
            },
          },
        },
      ];
    }

    const clients = await prismaClient.client.findMany({
      where: filter,
      orderBy: {
        create_at: "asc",
      },
      include: {
        client_tournaments: {
          include: {
            purchases: true,
          },
        },
        client_cashs: true,
      },
    });

    return clients;
  }
}

export { ListClientsChairService };
