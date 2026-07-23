import prismaClient from "../../prisma";

interface EditPurchaseRequest {
  purchase_id: string;
  name: string;
  token: number;
  token_staff: number;
  value_staff: number;
  value: number;
  max_limit: number;
  is_staff: boolean;
  multiple: boolean;
  cashier: string;
  club_id: string;
  type: string;
}

class EditPurchaseTournamentService {
  async execute({
    purchase_id,
    name,
    cashier,
    value,
    max_limit,
    token,
    value_staff,
    type,
    token_staff,
    multiple,
    club_id,
    is_staff,
  }: EditPurchaseRequest) {
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

    if (
      !name ||
      !cashier ||
      (type != "service" && !token) ||
      (is_staff && !token_staff)
    ) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const nameExists = await prismaClient.purchase.findFirst({
      where: {
        name: name,
        tournament_id: purchase.tournament_id,
        id: {
          not: purchase_id
        }
      },
    });

    if (nameExists) {
      throw new Error("Compra já criada com esse nome");
    }

    const updatedPurchase = await prismaClient.purchase.update({
      where: {
        id: purchase_id,
      },
      data: {
        name: name,
        cashier: cashier,
        value: value || 0,
        max_limit: max_limit || 0,
        token: token,
        type: type,
        value_staff: value_staff || 0,
        token_staff: token_staff || 0,
        multiple: multiple || false,
        is_staff: is_staff || false,
      },
    });

    return updatedPurchase;
  }
}

export { EditPurchaseTournamentService };
