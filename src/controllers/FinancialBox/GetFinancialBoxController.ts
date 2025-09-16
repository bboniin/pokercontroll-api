import { Request, Response } from "express";
import { GetFinancialBoxService } from "../../services/FinancialBox/GetFinancialBoxService";

class GetFinancialBoxController {
  async handle(req: Request, res: Response) {
    let { box_id } = req.query;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const getFinancialBoxService = new GetFinancialBoxService();

    const financialBox = await getFinancialBoxService.execute({
      user_id,
      club_id,
      box_id: box_id ? String(box_id) : "",
    });

    return res.json(financialBox);
  }
}

export { GetFinancialBoxController };
