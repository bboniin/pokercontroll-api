import { Request, Response } from "express";
import { ListChipsService } from "../../services/Chip/ListChipsService";

class ListChipsController {
  async handle(req: Request, res: Response) {
    let club_id = req.club_id;

    const listChipsService = new ListChipsService();

    const chips = await listChipsService.execute({
      club_id,
    });

    return res.json(chips);
  }
}

export { ListChipsController };
