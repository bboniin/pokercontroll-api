"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCashController = void 0;
var _CreateCashService = require("../../services/Cash/CreateCashService");
class CreateCashController {
  async handle(req, res) {
    const {
      name,
      briefcase,
      chairs
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const createCashService = new _CreateCashService.CreateCashService();
    const cash = await createCashService.execute({
      club_id,
      name,
      chairs,
      briefcase,
      user_id
    });
    return res.json(cash);
  }
}
exports.CreateCashController = CreateCashController;