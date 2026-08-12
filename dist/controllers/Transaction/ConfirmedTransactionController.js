"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfirmedTransactionController = void 0;
var _ConfirmedTransactionService = require("../../services/Transaction/ConfirmedTransactionService");
var _ConfirmedDealerService = require("../../services/Transaction/ConfirmedDealerService");
var _ConfirmedPassportService = require("../../services/Transaction/ConfirmedPassportService");
var _ConfirmedJackpotService = require("../../services/Transaction/ConfirmedJackpotService");
var _PaymentDebtsService = require("../../services/Transaction/PaymentDebtsService");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _GetTransactionService = require("../../services/Transaction/GetTransactionService");
class ConfirmedTransactionController {
  async handle(req, res) {
    const {
      id
    } = req.params;
    const {
      methods_transaction,
      date_payment,
      observation
    } = req.body;
    let user_id = req.user_id;
    const getTransactionService = new _GetTransactionService.GetTransactionService();
    const transaction = await getTransactionService.execute({
      id
    });
    let club_id = req.club_id;
    let valueDebit = methods_transaction.filter(item => item["id"] == "Pag Dívida").length != 0 ? methods_transaction.filter(item => item["id"] == "Pag Dívida")[0].value : 0;
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
    const valuePaid = methods_transaction.reduce((acc, item) => acc + item.value, 0) - valueReceive - valueCredit - valueDebit;
    if (valueCredit && methods_transaction.length == 1) {
      throw new Error("Não é possivel pagar somente com crédito");
    }
    if (transaction.client_id) {
      if (valueDebit) {
        const paymentDebtsService = new _PaymentDebtsService.PaymentDebtsService();
        await paymentDebtsService.execute({
          value: valueDebit,
          client_id: transaction.client_id,
          club_id,
          confirm: true,
          user_id
        });
      }
      if (valueReceive) {
        const paymentReceivesService = new _PaymentReceivesService.PaymentReceivesService();
        await paymentReceivesService.execute({
          value: valueReceive,
          client_id: transaction.client_id,
          club_id,
          confirm: true,
          user_id
        });
      }
    }
    if (transaction.type == "clube") {
      const confirmedTransactionService = new _ConfirmedTransactionService.ConfirmedTransactionService();
      const transaction = await confirmedTransactionService.execute({
        id,
        club_id,
        valueCredit,
        date_payment,
        methods_transaction,
        valueReceive,
        valueDebit,
        observation,
        user_id
      });
      return res.json(transaction);
    }
    if (transaction.type == "dealer") {
      const confirmedDealerService = new _ConfirmedDealerService.ConfirmedDealerService();
      const dealer = await confirmedDealerService.execute({
        id,
        club_id,
        valueCredit,
        date_payment,
        methods_transaction,
        valueReceive,
        valueDebit,
        observation,
        user_id
      });
      return res.json(dealer);
    }
    if (transaction.type == "jackpot") {
      const confirmedJackpotService = new _ConfirmedJackpotService.ConfirmedJackpotService();
      const jackpot = await confirmedJackpotService.execute({
        id,
        club_id,
        valueCredit,
        date_payment,
        methods_transaction,
        valueReceive,
        valueDebit,
        observation,
        user_id
      });
      return res.json(jackpot);
    }
    if (transaction.type == "passport") {
      const confirmedPassportService = new _ConfirmedPassportService.ConfirmedPassportService();
      const passport = await confirmedPassportService.execute({
        id,
        club_id,
        valueCredit,
        date_payment,
        methods_transaction,
        valueReceive,
        valueDebit,
        observation,
        user_id
      });
      return res.json(passport);
    }
    throw new Error("Nenhum tipo de caixa foi enviado");
  }
}
exports.ConfirmedTransactionController = ConfirmedTransactionController;