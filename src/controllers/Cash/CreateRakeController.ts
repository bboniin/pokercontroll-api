import { Request, Response } from "express";
import { CreateRakeService } from "../../services/Cash/CreateRakeService";

class CreateRakeController {
  async handle(req: Request, res: Response) {
    const { value } = req.body;
    const { id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const createRakeService = new CreateRakeService();

    const rake = await createRakeService.execute({
      club_id,
      user_id,
      id,
      value,
    });

    return res.json(rake);
  }
}

export { CreateRakeController };
