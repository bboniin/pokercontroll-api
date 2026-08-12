"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RewardTournamentController = void 0;
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _PaymentDebtsService = require("../../services/Transaction/PaymentDebtsService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
class RewardTournamentController {
  async handle(req, res) {
    const {
      sector_id,
      value,
      client_id,
      methods_transaction,
      date_payment,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const createTransactionService = new _CreateTransactionService.CreateTransactionService();
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    let valueDebit = methods_transaction.filter(item => item["id"] == "Pag Dívida").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    if (valueCredit) {
      const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
      await verifyCreditTransactionService.execute({
        client_id,
        club_id,
        value: valueCredit,
        club: false
      });
    }
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
      paid: valueDebit == value ? true : valueCredit ? false : true,
      value,
      type: "clube",
      methods_transaction: methods_transaction,
      items_transaction: [{
        name: "tournament",
        value: value,
        amount: 1
      }],
      client_id,
      sector_id,
      club_id,
      date_payment,
      observation,
      operation: "saida",
      valueReceive: 0,
      valueDebit,
      user_id
    });
    return res.json(transaction);
  }
}
exports.RewardTournamentController = RewardTournamentController;