"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTransactionClubeController = void 0;
var _CreateTransactionClubeService = require("../../services/Transaction/CreateTransactionClubeService");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _PaymentDebtsService = require("../../services/Transaction/PaymentDebtsService");
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
class CreateTransactionClubeController {
  async handle(req, res) {
    const {
      value,
      type,
      name,
      client_id,
      date_payment,
      methods_transaction,
      observation,
      operation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    if (client_id) {
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
      const createTransactionService = new _CreateTransactionService.CreateTransactionService();
      const transaction = await createTransactionService.execute({
        paid: valueCredit ? false : true,
        value,
        type: "clube",
        methods_transaction,
        items_transaction: [{
          name: name || "Manual",
          amount: 1,
          value: value
        }],
        club_id,
        date_payment,
        sector_id: "",
        observation,
        operation,
        client_id,
        valueReceive,
        valueDebit,
        user_id
      });
      return res.json(transaction);
    } else {
      const createTransactionClubeService = new _CreateTransactionClubeService.CreateTransactionClubeService();
      const transaction = await createTransactionClubeService.execute({
        paid: valueCredit ? false : true,
        value,
        type,
        methods_transaction,
        items_transaction: {
          name: name || "Manual",
          amount: 1,
          value: value
        },
        club_id,
        date_payment,
        observation,
        operation,
        valueReceive: 0,
        valueDebit: 0,
        user_id
      });
      return res.json(transaction);
    }
  }
}
exports.CreateTransactionClubeController = CreateTransactionClubeController;