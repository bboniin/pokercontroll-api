import { Request, Response } from "express";
import { FinishRankingService } from "../../services/Ranking/FinishRankingService";

class FinishRankingController {
  async handle(req: Request, res: Response) {
    const { ranking_id } = req.params;

    let club_id = req.club_id;

    const finishRankingService = new FinishRankingService();

    const ranking = await finishRankingService.execute({
      club_id,
      ranking_id,
    });

    return res.json(ranking);
  }
}

export { FinishRankingController };
