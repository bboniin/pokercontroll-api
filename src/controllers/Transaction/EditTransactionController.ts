import { Request, Response } from "express";
import { EditTransactionService } from "../../services/Transaction/EditTransactionService";

class EditTransactionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { observation, value } = req.body;

    let club_id = req.club_id;

    const editTransactionService = new EditTransactionService();

    const transaction = await editTransactionService.execute({
      id,
      club_id,
      observation,
      value,
    });

    return res.json(transaction);
  }
}

export { EditTransactionController };
