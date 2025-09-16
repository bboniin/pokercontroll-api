import { Request, Response } from "express";
import { EndFinancialBoxService } from "../../services/FinancialBox/EndFinancialBoxService";

class EndFinancialBoxController {
  async handle(req: Request, res: Response) {
    const { box_id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const endFinancialBoxService = new EndFinancialBoxService();

    const financialBox = await endFinancialBoxService.execute({
      box_id,
      user_id,
      club_id,
    });

    return res.json(financialBox);
  }
}

export { EndFinancialBoxController };
