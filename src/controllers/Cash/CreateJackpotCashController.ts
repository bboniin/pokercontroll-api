import { Request, Response } from "express";
import { CreateJackpotCashService } from "../../services/Cash/CreateJackpotCashService";

class CreateJackpotCashController {
  async handle(req: Request, res: Response) {
    const { value } = req.body;
    const { id } = req.params; // representa o cash_id

    let club_id = req.club_id;
    let user_id = req.user_id;

    const createJackpotCashService = new CreateJackpotCashService();

    const jackpot = await createJackpotCashService.execute({
      club_id,
      user_id,
      id,
      value,
    });

    return res.json(jackpot);
  }
}

export { CreateJackpotCashController };
