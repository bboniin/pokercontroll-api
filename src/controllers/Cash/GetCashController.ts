import { Request, Response } from "express";
import { GetCashService } from "../../services/Cash/GetCashService";

class GetCashController {
  async handle(req: Request, res: Response) {
    let club_id = req.club_id;
    const { cash_id } = req.params;

    const getCashService = new GetCashService();

    const cash = await getCashService.execute({
      club_id,
      cash_id,
    });

    return res.json(cash);
  }
}

export { GetCashController };
