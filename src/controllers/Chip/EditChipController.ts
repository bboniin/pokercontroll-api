import { Request, Response } from "express";
import { EditChipService } from "../../services/Chip/EditChipService";

class EditChipController {
  async handle(req: Request, res: Response) {
    const { chip_id } = req.params;
    const { color, value } = req.body;

    let club_id = req.club_id;

    const editChipService = new EditChipService();

    const chip = await editChipService.execute({
      color,
      value,
      club_id,
      chip_id,
    });

    return res.json(chip);
  }
}

export { EditChipController };
