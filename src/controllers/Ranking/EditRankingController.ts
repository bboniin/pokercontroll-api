import { Request, Response } from "express";
import { EditRankingService } from "../../services/Ranking/EditRankingService";

class EditRankingController {
  async handle(req: Request, res: Response) {
    const { ranking_id } = req.params;
    const { name, goal_value, description } = req.body;

    let club_id = req.club_id;

    const editRankingService = new EditRankingService();

    const ranking = await editRankingService.execute({
      name,
      goal_value: goal_value ? parseFloat(goal_value) : 0,
      description,
      club_id,
      ranking_id,
    });

    return res.json(ranking);
  }
}

export { EditRankingController };
