import { Request, Response } from "express";
import { ListTransactionsBankService } from "../../services/Bank/ListTransactionsBankService";

class ListTransactionsBankController {
  async handle(req: Request, res: Response) {
    let { bank_id } = req.params;
    let { page, all } = req.query;

    const listTransactionsBankService = new ListTransactionsBankService();

    const transactions = await listTransactionsBankService.execute({
      bank_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
    });

    return res.json(transactions);
  }
}

export { ListTransactionsBankController };
