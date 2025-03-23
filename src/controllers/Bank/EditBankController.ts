import { Request, Response } from "express";
import { EditBankService } from "../../services/Bank/EditBankService";

class EditBankController {
  async handle(req: Request, res: Response) {
    const { bank_id } = req.params;
    const { name, balance } = req.body;

    let club_id = req.club_id;

    const editBankService = new EditBankService();

    const bank = await editBankService.execute({
      name,
      balance,
      club_id,
      bank_id,
    });

    return res.json(bank);
  }
}

export { EditBankController };
