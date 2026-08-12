import { Request, Response } from "express";
import { CreateChipService } from "../../services/Chip/CreateChipService";

class CreateChipController {
  async handle(req: Request, res: Response) {
    const { color, value } = req.body;

    let club_id = req.club_id;

    const createChipService = new CreateChipService();

    const chip = await createChipService.execute({
      color,
      value,
      club_id,
    });
    return res.json(chip);
  }
}

export { CreateChipController };
