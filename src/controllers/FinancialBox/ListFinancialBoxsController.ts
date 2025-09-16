import { Request, Response } from "express";
import { ListFinancialBoxsService } from "../../services/FinancialBox/ListFinancialBoxsService";

class ListfinancialBoxsController {
  async handle(req: Request, res: Response) {
    let { page, all } = req.query;
    let club_id = req.club_id;
    let user_id = req.user_id;

    const listFinancialBoxsService = new ListFinancialBoxsService();

    const financialBoxs = await listFinancialBoxsService.execute({
      club_id,
      user_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
    });

    return res.json(financialBoxs);
  }
}

export { ListfinancialBoxsController };
