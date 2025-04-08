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

    const transactions = await prismaClient.transaction.findMany({
      where: {
        client_id: client_id,
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
