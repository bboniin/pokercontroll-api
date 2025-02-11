import { Request, Response } from "express";
import { CreateRankingService } from "../../services/Ranking/CreateRankingService";

class CreateRankingController {
  async handle(req: Request, res: Response) {
    const { name, description, goal_value } = req.body;

    let club_id = req.club_id;

    const createRankingService = new CreateRankingService();

    const ranking = await createRankingService.execute({
      name,
      goal_value: goal_value ? parseFloat(goal_value) : 0,
      description,
      club_id,
    });

    return res.json(ranking);
  }
}

export { CreateRankingController };
