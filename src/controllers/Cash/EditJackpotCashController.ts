import { Request, Response } from "express";
import { EditJackpotCashService } from "../../services/Cash/EditJackpotCashService";

class EditJackpotCashController {
  async handle(req: Request, res: Response) {
    const { value } = req.body;
    const { id } = req.params; // representa o jackpot_id

    let club_id = req.club_id;
    let user_id = req.user_id;

    const editJackpotCashService = new EditJackpotCashService();

    const jackpot = await editJackpotCashService.execute({
      club_id,
      user_id,
      id,
      value,
    });

    return res.json(jackpot);
  }
}

export { EditJackpotCashController };
