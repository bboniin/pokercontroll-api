import { Request, Response } from "express";
import { DeleteBankService } from "../../services/Bank/DeleteBankService";

class DeleteBankController {
  async handle(req: Request, res: Response) {
    const { bank_id } = req.params;

    let club_id = req.club_id;

    const deleteBankService = new DeleteBankService();

    const bank = await deleteBankService.execute({
      club_id,
      bank_id,
    });

    return res.json(bank);
  }
}

export { DeleteBankController };
