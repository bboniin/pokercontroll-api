import prismaClient from "../../prisma";

interface BalanceRulesRequest {
  club_id: string;
  allow_balance_cash: boolean;
  allow_balance_bar: boolean;
  allow_balance_event: boolean;
}

class UpdateClubBalanceRulesService {
  async execute({
    club_id,
    allow_balance_cash,
    allow_balance_bar,
    allow_balance_event,
  }: BalanceRulesRequest) {
    if (!club_id) {
      throw new Error("ID do clube é obrigatório");
    }

    const club = await prismaClient.club.update({
      where: {
        id: club_id,
      },
      data: {
        allow_balance_cash: !!allow_balance_cash,
        allow_balance_bar: !!allow_balance_bar,
        allow_balance_event: !!allow_balance_event,
      },
    });

    return {
      allow_balance_cash: club.allow_balance_cash,
      allow_balance_bar: club.allow_balance_bar,
      allow_balance_event: club.allow_balance_event,
    };
  }
}

export { UpdateClubBalanceRulesService };
