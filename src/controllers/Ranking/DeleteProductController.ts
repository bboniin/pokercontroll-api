import { Request, Response } from "express";
import { DeleteRankingService } from "../../services/Ranking/DeleteRankingService";

class DeleteRankingController {
  async handle(req: Request, res: Response) {
    const { ranking_id } = req.params;

    let club_id = req.club_id;

    const deleteRankingService = new DeleteRankingService();

    const ranking = await deleteRankingService.execute({
      club_id,
      ranking_id,
    });

    return res.json(ranking);
  }
}

export { DeleteRankingController };
