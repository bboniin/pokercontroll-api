import prismaClient from "../../prisma";

interface DeletePurchaseRequest {
  purchase_id: string;
  club_id: string;
}

class DeletePurchaseTournamentService {
  async execute({ purchase_id, club_id }: DeletePurchaseRequest) {
    if (!club_id || !purchase_id) {
      throw new Error("Envie o id do clube e da compra");
    }

    const purchase = await prismaClient.purchase.findFirst({
      where: {
        id: purchase_id,
      },
      include: {
        tournament: true,
      }
    });

    if (!purchase) {
      throw new Error("Compra não encontrada");
    }

    if (purchase.tournament.club_id !== club_id) {
      throw new Error("Não autorizado");
    }

    await prismaClient.purchase.delete({
      where: {
        id: purchase_id,
      },
    });

    return { message: "Compra excluída com sucesso" };
  }
}

export { DeletePurchaseTournamentService };
