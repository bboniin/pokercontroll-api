"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuyCashController = void 0;
var _BuyCashService = require("../../services/Cash/BuyCashService");
class BuyCashController {
  async handle(req, res) {
    const {
      value,
      sector_id,
      methods_transaction,
      client_id,
      date_payment,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const buyCashService = new _BuyCashService.BuyCashService();
    try {
      const transaction = await buyCashService.execute({
        value: value ? parseFloat(value) : 0,
        sector_id,
        methods_transaction,
        client_id,
        date_payment,
        observation,
        club_id,
        user_id
      });
      return res.json(transaction);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
}
exports.BuyCashController = BuyCashController;