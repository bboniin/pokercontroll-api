import { Request, Response } from "express";
import { StartRankingService } from "../../services/Ranking/StartRankingService";

class StartRankingController {
  async handle(req: Request, res: Response) {
    const { ranking_id } = req.params;

    let club_id = req.club_id;

    const startRankingService = new StartRankingService();

    const ranking = await startRankingService.execute({
      club_id,
      ranking_id,
    });

    return res.json(ranking);
  }
}

export { StartRankingController };
