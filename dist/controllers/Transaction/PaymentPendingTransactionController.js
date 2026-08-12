"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentPendingTransactionController = void 0;
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _PaymentPendingService = require("../../services/Transaction/PaymentPendingService");
var _ListTransactionsPendingService = require("../../services/Transaction/ListTransactionsPendingService");
class PaymentPendingTransactionController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    const {
      methods_transaction,
      date_payment,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
    if (client_id) {
      const listPendingService = new _ListTransactionsPendingService.ListTransactionsPendingService();
      await listPendingService.execute({
        club_id,
        client_id
      });
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
    }
    const paymentPendingService = new _PaymentPendingService.PaymentPendingService();
    const transaction = await paymentPendingService.execute({
      club_id,
      date_payment,
      methods_transaction,
      observation,
      client_id,
      user_id
    });
    return res.json(transaction);
  }
}
exports.PaymentPendingTransactionController = PaymentPendingTransactionController;