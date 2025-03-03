import prismaClient from "../../prisma";

interface ClientRequest {
  club_id: string;
  page: number;
  all: boolean;
  search: string;
}

class ListClientsService {
  async execute({ club_id, page, all, search }: ClientRequest) {
    let filter = {};

    if (!all) {
      filter = {
        skip: page * 30,
        take: 30,
      };
    }

    let where = {
      club_id: club_id,
      visible: true,
    };

    if (search) {
      where["OR"] = [
        { name: { contains: search, mode: "insensitive" } },
        { cpf: { contains: search, mode: "insensitive" } },
        { phone_number: { contains: search, mode: "insensitive" } },
      ];
    }

    const clientsTotal = await prismaClient.client.count({
      where: where,
    });

    const clients = await prismaClient.client.findMany({
      ...filter,
      where: where,
      orderBy: {
        name: "asc",
      },
    });

    return { clients, clientsTotal };
  }
}

export { ListClientsService };
