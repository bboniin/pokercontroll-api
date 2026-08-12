import { Request, Response } from "express";
import { DeleteTransactionService } from "../../services/Transaction/DeleteTransactionService";

class DeleteTransactionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    let club_id = req.club_id;

    const deleteTransactionService = new DeleteTransactionService();

    try {
      const result = await deleteTransactionService.execute({
        id,
        club_id,
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { DeleteTransactionController };
