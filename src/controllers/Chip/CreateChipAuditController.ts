import { Request, Response } from "express";
import { CreateChipAuditService } from "../../services/Chip/CreateChipAuditService";

class CreateChipAuditController {
  async handle(req: Request, res: Response) {
    const { cash_id } = req.params;
    const { chips_value, briefcase_value } = req.body;

    let club_id = req.club_id;

    const createChipAuditService = new CreateChipAuditService();

    const chip = await createChipAuditService.execute({
      chips_value,
      briefcase_value,
      cash_id,
      club_id,
    });
    return res.json(chip);
  }
}

export { CreateChipAuditController };
