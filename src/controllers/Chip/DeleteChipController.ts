import { Request, Response } from "express";
import { DeleteChipService } from "../../services/Chip/DeleteChipService";

class DeleteChipController {
  async handle(req: Request, res: Response) {
    const { chip_id } = req.params;

    let club_id = req.club_id;

    const deleteChipService = new DeleteChipService();

    const chip = await deleteChipService.execute({
      club_id,
      chip_id,
    });

    return res.json(chip);
  }
}

export { DeleteChipController };
