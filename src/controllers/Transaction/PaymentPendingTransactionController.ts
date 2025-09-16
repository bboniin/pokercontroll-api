import { Request, Response } from "express";
import { PaymentReceivesService } from "../../services/Transaction/PaymentReceivesService";
import { PaymentPendingService } from "../../services/Transaction/PaymentPendingService";
import { ListTransactionsPendingService } from "../../services/Transaction/ListTransactionsPendingService";

class PaymentPendingTransactionController {
  async handle(req: Request, res: Response) {
    const { client_id } = req.params;
    const { methods_transaction, date_payment, observation } = req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    let valueReceive =
      methods_transaction.filter((item) => item["id"] == "Saldo").length != 0
        ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value
        : 0;

    if (client_id) {
      const listPendingService = new ListTransactionsPendingService();

      await listPendingService.execute({ club_id, client_id });

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
    }

    const paymentPendingService = new PaymentPendingService();

    const transaction = await paymentPendingService.execute({
      club_id,
      date_payment,
      methods_transaction,
      observation,
      client_id,
      user_id,
    });

    return res.json(transaction);
  }
}

export { PaymentPendingTransactionController };
