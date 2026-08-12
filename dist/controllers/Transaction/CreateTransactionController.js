"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTransactionController = void 0;
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _PaymentDebtsService = require("../../services/Transaction/PaymentDebtsService");
class CreateTransactionController {
  async handle(req, res) {
    const {
      value,
      sector_id,
      type,
      methods_transaction,
      items_transaction,
      client_id,
      date_payment,
      observation,
      operation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const createTransactionService = new _CreateTransactionService.CreateTransactionService();
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    if (valueCredit) {
      const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
      await verifyCreditTransactionService.execute({
        client_id,
        club_id,
        value: valueCredit,
        club: operation == "saida"
      });
    }
    let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
    const paymentReceivesService = new _PaymentReceivesService.PaymentReceivesService();
    if (valueReceive) {
      await paymentReceivesService.execute({
        value: valueReceive,
        client_id: client_id,
        club_id,
        confirm: false,
        user_id
      });
    }
    let valueDebit = methods_transaction.filter(item => item["id"] == "Pag Dívida").length != 0 ? methods_transaction.filter(item => item["id"] == "Pag Dívida")[0].value : 0;
    const paymentDebtsService = new _PaymentDebtsService.PaymentDebtsService();
    if (valueDebit) {
      await paymentDebtsService.execute({
        value: valueDebit,
        client_id,
        club_id,
        confirm: false,
        user_id
      });
    }
    const transaction = await createTransactionService.execute({
      paid: valueCredit ? false : true,
      value,
      type,
      sector_id,
      methods_transaction: methods_transaction,
      items_transaction,
      client_id,
      club_id,
      date_payment,
      observation,
      operation,
      valueReceive,
      valueDebit,
      user_id
    });
    return res.json(transaction);
  }
}
exports.CreateTransactionController = CreateTransactionController;