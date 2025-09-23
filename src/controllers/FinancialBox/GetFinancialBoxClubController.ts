import { Request, Response } from "express";
import { GetFinancialBoxClubService } from "../../services/FinancialBox/GetFinancialBoxClubService";

class GetFinancialBoxClubController {
  async handle(req: Request, res: Response) {
    let { box_id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const getFinancialBoxClubService = new GetFinancialBoxClubService();

    const financialBox = await getFinancialBoxClubService.execute({
      user_id,
      club_id,
      box_id,
    });

    return res.json(financialBox);
  }
}

export { GetFinancialBoxClubController };
