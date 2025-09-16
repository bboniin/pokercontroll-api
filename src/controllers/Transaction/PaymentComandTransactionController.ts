import { Request, Response } from "express";
import { PaymentReceivesService } from "../../services/Transaction/PaymentReceivesService";
import { PaymentComandService } from "../../services/Transaction/PaymentComandService";

class PaymentComandTransactionController {
  async handle(req: Request, res: Response) {
    const { client_id } = req.params;
    const { methods_transaction, date_payment, transactions, observation } =
      req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    let valueReceive =
      methods_transaction.filter((item) => item["id"] == "Saldo").length != 0
        ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value
        : 0;

    if (valueReceive) {
      const paymentReceivesService = new PaymentReceivesService();

      await paymentReceivesService.execute({
        value: valueReceive,
        client_id,
        club_id,
        confirm: true,
        user_id,
      });
    }

    const paymentComandService = new PaymentComandService();

    const transaction = await paymentComandService.execute({
      club_id,
      date_payment,
      methods_transaction,
      observation,
      transactions,
      client_id,
      user_id,
    });

    return res.json(transaction);
  }
}

export { PaymentComandTransactionController };
