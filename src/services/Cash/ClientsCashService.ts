import prismaClient from "../../prisma";

interface ClientRequest {
  club_id: string;
  cash_id: string;
}

class ClientsCashService {
  async execute({ cash_id }: ClientRequest) {
    const clients = await prismaClient.clientCash.findMany({
      where: {
        cash_id: cash_id,
      },
      orderBy: {
        exit: "asc",
      },
      include: {
        client: {
          include: {
            transactions: {
              where: {
                sector_id: cash_id,
              },
              orderBy: {
                create_at: "asc",
              },
              include: {
                methods_transaction: true,
                historics_transaction: {
                  orderBy: {
                    create_at: "desc",
                  },
                },
              },
            },
          },
        },
      },
    });

    return clients;
  }
}

export { ClientsCashService };
