import { Request, Response } from "express";
import { StartFinancialBoxService } from "../../services/FinancialBox/StartFinancialBoxService";

class StartFinancialBoxController {
  async handle(req: Request, res: Response) {
    let club_id = req.club_id;
    let user_id = req.user_id;

    const { value_initial } = req.body;

    const startFinancialBoxService = new StartFinancialBoxService();

    const financialBox = await startFinancialBoxService.execute({
      user_id,
      club_id,
      value_initial,
    });

    return res.json(financialBox);
  }
}

export { StartFinancialBoxController };
