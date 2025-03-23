import { Request, Response } from "express";
import { ListBanksService } from "../../services/Bank/ListBanksService";

class ListBanksController {
  async handle(req: Request, res: Response) {
    let club_id = req.club_id;

    const listBanksService = new ListBanksService();

    const banks = await listBanksService.execute({
      club_id,
    });

    return res.json(banks);
  }
}

export { ListBanksController };
