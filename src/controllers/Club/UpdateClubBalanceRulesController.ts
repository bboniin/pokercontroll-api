import { Request, Response } from "express";
import { UpdateClubBalanceRulesService } from "../../services/Club/UpdateClubBalanceRulesService";

class UpdateClubBalanceRulesController {
  async handle(req: Request, res: Response) {
    const { allow_balance_cash, allow_balance_bar, allow_balance_event, cash, bar, evento } = req.body;
    const club_id = req.club_id;

    // Aceita tanto formato snake_case quanto cash, bar, evento do frontend
    const resolvedCash = allow_balance_cash !== undefined ? allow_balance_cash : cash !== undefined ? cash : true;
    const resolvedBar = allow_balance_bar !== undefined ? allow_balance_bar : bar !== undefined ? bar : true;
    const resolvedEvent = allow_balance_event !== undefined ? allow_balance_event : evento !== undefined ? evento : true;

    const updateClubBalanceRulesService = new UpdateClubBalanceRulesService();
    const result = await updateClubBalanceRulesService.execute({
      club_id,
      allow_balance_cash: resolvedCash,
      allow_balance_bar: resolvedBar,
      allow_balance_event: resolvedEvent,
    });

    return res.json(result);
  }
}

export { UpdateClubBalanceRulesController };
