import prismaClient from "../../prisma";

interface TournamentRequest {
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
  tournament_id: string;
}

class NewPurchaseTournamentService {
  async execute({
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
    tournament_id,
  }: TournamentRequest) {
    if (!club_id || !tournament_id) {
      throw new Error("Envie o id do clube e do torneio");
    }

    const tournament = await prismaClient.tournament.findFirst({
      where: {
        id: tournament_id,
        club_id: club_id,
      },
    });

    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }

    if (
      !name ||
      !cashier ||
      !value ||
      (type != "service" && !token) ||
      (is_staff && !token_staff)
    ) {
      throw new Error("Preencha todos os campos para adicionar nova compra");
    }

    const purchase = await prismaClient.purchase.findFirst({
      where: {
        name: name,
        tournament_id: tournament.id,
      },
    });

    if (purchase) {
      throw new Error("Compra já criada com esse nome");
    }

    await prismaClient.purchase.create({
      data: {
        name: name,
        cashier: cashier,
        value: value,
        max_limit: max_limit || 0,
        token: token,
        type: type,
        value_staff: value_staff || 0,
        token_staff: token_staff || 0,
        multiple: multiple || false,
        is_staff: is_staff || false,
        tournament_id: tournament.id,
      },
    });

    return tournament;
  }
}

export { NewPurchaseTournamentService };
