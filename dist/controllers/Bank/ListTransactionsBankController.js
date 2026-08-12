"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTransactionsBankController = void 0;
var _ListTransactionsBankService = require("../../services/Bank/ListTransactionsBankService");
class ListTransactionsBankController {
  async handle(req, res) {
    let {
      bank_id
    } = req.params;
    let {
      page,
      all
    } = req.query;
    const listTransactionsBankService = new _ListTransactionsBankService.ListTransactionsBankService();
    const transactions = await listTransactionsBankService.execute({
      bank_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(transactions);
  }
}
exports.ListTransactionsBankController = ListTransactionsBankController;