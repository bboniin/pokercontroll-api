import { Request, Response } from "express";
import { ListFinancialBoxsClubService } from "../../services/FinancialBox/ListFinancialBoxsClubService";

class ListFinancialBoxsClubController {
  async handle(req: Request, res: Response) {
    let { page, all, user_id } = req.query;
    let club_id = req.club_id;
    let admin_id = req.user_id;

    const listFinancialBoxsClubService = new ListFinancialBoxsClubService();

    const financialBoxsClub = await listFinancialBoxsClubService.execute({
      club_id,
      user_id: user_id ? String(user_id) : "",
      admin_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
    });

    return res.json(financialBoxsClub);
  }
}

export { ListFinancialBoxsClubController };
