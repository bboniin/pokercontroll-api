"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetCashController = void 0;
var _GetCashService = require("../../services/Cash/GetCashService");
class GetCashController {
  async handle(req, res) {
    let club_id = req.club_id;
    const {
      cash_id
    } = req.params;
    const getCashService = new _GetCashService.GetCashService();
    const cash = await getCashService.execute({
      club_id,
      cash_id
    });
    return res.json(cash);
  }
}
exports.GetCashController = GetCashController;