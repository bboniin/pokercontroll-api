"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddCashController = void 0;
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _MoveCashService = require("../../services/Cash/MoveCashService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
class AddCashController {
  async handle(req, res) {
    const {
      chair,
      id,
      sector_id,
      value,
      methods_transaction,
      date_payment,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    if (valueCredit) {
      const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
      await verifyCreditTransactionService.execute({
        client_id: id,
        club_id,
        value: valueCredit,
        club: false
      });
    }
    let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
    const paymentReceivesService = new _PaymentReceivesService.PaymentReceivesService();
    if (valueReceive) {
      await paymentReceivesService.execute({
        value: valueReceive,
        client_id: id,
        club_id,
        confirm: false,
        user_id
      });
    }
    const createTransactionService = new _CreateTransactionService.CreateTransactionService();
    await createTransactionService.execute({
      paid: valueReceive == value ? true : valueCredit ? false : true,
      value,
      type: "clube",
      methods_transaction,
      items_transaction: [{
        name: "cash",
        amount: 1,
        value: value
      }],
      client_id: id,
      sector_id,
      club_id,
      date_payment,
      observation,
      operation: "entrada",
      valueReceive,
      valueDebit: 0,
      user_id
    });
    const moveCashService = new _MoveCashService.MoveCashService();
    const client = await moveCashService.execute({
      chair,
      id,
      club_id,
      cash_id: sector_id
    });
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json(client);
  }
}
exports.AddCashController = AddCashController;