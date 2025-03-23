import { Request, Response } from "express";
import { CreateBankService } from "../../services/Bank/CreateBankService";

class CreateBankController {
  async handle(req: Request, res: Response) {
    const { name, balance } = req.body;

    let club_id = req.club_id;

    const createBankService = new CreateBankService();

    const bank = await createBankService.execute({
      name,
      balance,
      club_id,
    });

    return res.json(bank);
  }
}

export { CreateBankController };
