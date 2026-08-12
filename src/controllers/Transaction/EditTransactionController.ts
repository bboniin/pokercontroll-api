import { Request, Response } from "express";
import { EditTransactionService } from "../../services/Transaction/EditTransactionService";

class EditTransactionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { observation, value, methods_transaction, date_payment } = req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const editTransactionService = new EditTransactionService();

    try {
      const transaction = await editTransactionService.execute({
        id,
        club_id,
        observation,
        value: value ? parseFloat(value) : 0,
        methods_transaction,
        date_payment,
        user_id,
      });

      return res.json(transaction);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { EditTransactionController };
