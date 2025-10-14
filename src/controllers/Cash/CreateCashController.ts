import { Request, Response } from "express";
import { CreateCashService } from "../../services/Cash/CreateCashService";

class CreateCashController {
  async handle(req: Request, res: Response) {
    const { name, briefcase, chairs } = req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const createCashService = new CreateCashService();

    const cash = await createCashService.execute({
      club_id,
      name,
      chairs,
      briefcase,
      user_id,
    });

    return res.json(cash);
  }
}

export { CreateCashController };
