import { Request, Response } from "express";
import { GetRankingService } from "../../services/Ranking/GetRankingService";

class GetRankingController {
  async handle(req: Request, res: Response) {
    const { ranking_id } = req.params;

    let club_id = req.club_id;

    const getRankingService = new GetRankingService();

    const ranking = await getRankingService.execute({
      ranking_id,
      club_id,
    });

    return res.json(ranking);
  }
}

export { GetRankingController };
