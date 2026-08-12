"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentComandTransactionController = void 0;
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _PaymentComandService = require("../../services/Transaction/PaymentComandService");
class PaymentComandTransactionController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    const {
      methods_transaction,
      date_payment,
      transactions,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
    if (valueReceive) {
      const paymentReceivesService = new _PaymentReceivesService.PaymentReceivesService();
      await paymentReceivesService.execute({
        value: valueReceive,
        client_id,
        club_id,
        confirm: true,
        user_id
      });
    }
    const paymentComandService = new _PaymentComandService.PaymentComandService();
    const transaction = await paymentComandService.execute({
      club_id,
      date_payment,
      methods_transaction,
      observation,
      transactions,
      client_id,
      user_id
    });
    return res.json(transaction);
  }
}
exports.PaymentComandTransactionController = PaymentComandTransactionController;