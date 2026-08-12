import { Request, Response } from "express";
import { ExitClientCashService } from "../../services/Cash/ExitClientCashService";
import { CreateTransactionService } from "../../services/Transaction/CreateTransactionService";
import { PaymentDebtsService } from "../../services/Transaction/PaymentDebtsService";
import { VerifyCreditTransactionService } from "../../services/Transaction/VerifyCreditTransactionService";

class ExitClientCashController {
  async handle(req: Request, res: Response) {
    const { client_id } = req.params;
    const { sector_id, value, methods_transaction, date_payment, observation } =
      req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    let valueDebit =
      methods_transaction.filter((item) => item["id"] == "Pag Dívida").length !=
      0
        ? methods_transaction.filter((item) => item["id"] == "Pag Dívida")[0]
            .value
        : 0;
    let valueCredit =
      methods_transaction.filter((item) => item["id"] == "Crédito").length != 0
        ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value
        : 0;

    if (valueCredit) {
      const verifyCreditTransactionService =
        new VerifyCreditTransactionService();

      await verifyCreditTransactionService.execute({
        client_id,
        club_id,
        value: valueCredit,
        club: true,
      });
    }

    const paymentDebtsService = new PaymentDebtsService();

    if (valueDebit) {
      await paymentDebtsService.execute({
        value: valueDebit,
        client_id,
        club_id,
        confirm: false,
        user_id,
      });
    }

    const createTransactionService = new CreateTransactionService();

    const transaction = await createTransactionService.execute({
      paid: valueDebit == value ? true : valueCredit ? false : true,
      value,
      type: "clube",
      methods_transaction,
      items_transaction: [
        {
          name: "cash",
          amount: 1,
          value: value,
        },
      ],
      client_id,
      sector_id,
      club_id,
      date_payment,
      observation,
      operation: "saida",
      valueReceive: 0,
      valueDebit,
      user_id,
    });

    const exitClientCashService = new ExitClientCashService();

    await exitClientCashService.execute({
      client_id,
      club_id,
      cash_id: sector_id,
    });

    return res.json(transaction);
  }
}

export { ExitClientCashController };
