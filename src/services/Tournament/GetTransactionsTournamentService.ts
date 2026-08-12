import prismaClient from "../../prisma";

interface TournamentRequest {
  id: string;
  club_id: string;
  client_id: string;
}

class GetTransactionsTournamentService {
  async execute({ id, club_id, client_id }: TournamentRequest) {
    if (!id || !club_id || !client_id) {
      throw new Error("Envie o id do cliente, torneio e do clube");
    }

    const client = await prismaClient.client.findUnique({
      where: { id: client_id },
    });
    const clientName = client ? client.name : "";

    const transactions = await prismaClient.transaction.findMany({
      where: {
        OR: [
          {
            client_id: client_id,
            NOT: {
              observation: {
                contains: "Pago para ",
              },
            },
          },
          ...(clientName
            ? [
                {
                  observation: {
                    contains: `Pago para ${clientName}`,
                  },
                },
              ]
            : []),
        ],
        club_id: club_id,
        sector_id: id,
      },
      include: {
        items_transaction: true,
      },
    });

    return transactions;
  }
}

export { GetTransactionsTournamentService };
