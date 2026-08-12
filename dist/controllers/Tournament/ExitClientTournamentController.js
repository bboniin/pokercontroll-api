"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExitClientTournamentController = void 0;
var _ExitClientTournamentService = require("../../services/Tournament/ExitClientTournamentService");
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _PaymentDebtsService = require("../../services/Transaction/PaymentDebtsService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
class ExitClientTournamentController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    const {
      tournament_id,
      position,
      sector_id,
      methods_transaction,
      datePayment,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const exitClientTournamentService = new _ExitClientTournamentService.ExitClientTournamentService();
    const {
      tournament,
      award
    } = await exitClientTournamentService.execute({
      client_id,
      tournament_id,
      position
    });
    if (award) {
      let valueDebit = methods_transaction.filter(item => item["id"] == "Pag Dívida").length != 0 ? methods_transaction.filter(item => item["id"] == "Pag Dívida")[0].value : 0;
      let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
      if (valueCredit) {
        const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
        await verifyCreditTransactionService.execute({
          client_id,
          club_id,
          value: valueCredit,
          club: true
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
      const createTransactionService = new _CreateTransactionService.CreateTransactionService();
      await createTransactionService.execute({
        paid: valueDebit == award ? true : valueCredit ? false : true,
        value: award,
        type: "clube",
        methods_transaction: methods_transaction,
        items_transaction: [{
          name: "torneio",
          value: award,
          amount: 1
        }],
        client_id,
        sector_id,
        club_id,
        date_payment: datePayment,
        valueReceive: 0,
        valueDebit,
        observation: observation,
        operation: "saida",
        user_id
      });
    }
    return res.json(tournament);
  }
}
exports.ExitClientTournamentController = ExitClientTournamentController;