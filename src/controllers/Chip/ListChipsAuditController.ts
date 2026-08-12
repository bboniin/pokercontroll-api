import { Request, Response } from "express";
import { ListChipsAuditService } from "../../services/Chip/ListChipsAuditService";

class ListChipsAuditController {
  async handle(req: Request, res: Response) {
    const { cash_id } = req.params;
    let club_id = req.club_id;

    const listChipsAuditService = new ListChipsAuditService();

    const chips = await listChipsAuditService.execute({
      club_id,
      cash_id,
    });

    return res.json(chips);
  }
}

export { ListChipsAuditController };
