"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListPayablesController = void 0;
var _ListPayablesService = require("../../services/Payable/ListPayablesService");
class ListPayablesController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    const listPayablesService = new _ListPayablesService.ListPayablesService();
    const payables = await listPayablesService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(payables);
  }
}
exports.ListPayablesController = ListPayablesController;