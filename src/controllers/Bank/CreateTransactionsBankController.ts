import { Request, Response } from "express";
import { CreateTransactionBankService } from "../../services/Bank/CreateTransactionBankService";

class CreateTransactionBankController {
  async handle(req: Request, res: Response) {
    const { name, observation, value, operation, bank_id } = req.body;

    let club_id = req.club_id;

    const createTransactionBankService = new CreateTransactionBankService();

    const bank = await createTransactionBankService.execute({
      name,
      value,
      club_id,
      observation,
      operation,
      bank_id,
    });
    return res.json(bank);
  }
}

export { CreateTransactionBankController };
