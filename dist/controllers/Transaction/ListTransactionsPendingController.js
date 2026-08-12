"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTransactionsPendingController = void 0;
var _ListTransactionsPendingService = require("../../services/Transaction/ListTransactionsPendingService");
class ListTransactionsPendingController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    let club_id = req.club_id;
    const listTransactionsPendingService = new _ListTransactionsPendingService.ListTransactionsPendingService();
    const transactionsPending = await listTransactionsPendingService.execute({
      club_id,
      client_id
    });
    return res.json(transactionsPending);
  }
}
exports.ListTransactionsPendingController = ListTransactionsPendingController;