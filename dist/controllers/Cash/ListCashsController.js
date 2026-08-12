"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCashsController = void 0;
var _ListCashsService = require("../../services/Cash/ListCashsService");
class ListCashsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    const listCashsService = new _ListCashsService.ListCashsService();
    const cash = await listCashsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(cash);
  }
}
exports.ListCashsController = ListCashsController;