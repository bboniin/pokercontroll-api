import prismaClient from "../../prisma";

interface ClientRequest {
  club_id: string;
  tournament_id: string;
}

class ListClientsChairService {
  async execute({ club_id, tournament_id }: ClientRequest) {
    let filter = {
      club_id: club_id,
      visible: true,
    };

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
      filter["chair_cash"] = "";
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
      },
    });

    return clients;
  }
}

export { ListClientsChairService };
