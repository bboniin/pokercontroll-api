"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndCashController = void 0;
var _EndCashService = require("../../services/Cash/EndCashService");
class EndCashController {
  async handle(req, res) {
    const {
      cash_id
    } = req.params;
    let club_id = req.club_id;
    const endCashService = new _EndCashService.EndCashService();
    const cash = await endCashService.execute({
      club_id,
      cash_id
    });
    return res.json(cash);
  }
}
exports.EndCashController = EndCashController;