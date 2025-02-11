import { Request, Response } from "express";
import { ListRankingsService } from "../../services/Ranking/ListRankingsService";

class ListRankingsController {
  async handle(req: Request, res: Response) {
    let { page, all } = req.query;
    let club_id = req.club_id;

    const listRankingsService = new ListRankingsService();

    const { rankings, rankingsTotal } = await listRankingsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
    });

    return res.json({ rankings, rankingsTotal });
  }
}

export { ListRankingsController };
