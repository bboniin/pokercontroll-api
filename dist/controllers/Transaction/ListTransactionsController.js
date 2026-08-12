"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTransactionsController = void 0;
var _ListTransactionsService = require("../../services/Transaction/ListTransactionsService");
class ListTransactionsController {
  async handle(req, res) {
    let {
      filter,
      page
    } = req.body;
    let club_id = req.club_id;
    const listTransactionsService = new _ListTransactionsService.ListTransactionsService();
    const transactions = await listTransactionsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      filter
    });
    return res.json(transactions);
  }
}
exports.ListTransactionsController = ListTransactionsController;