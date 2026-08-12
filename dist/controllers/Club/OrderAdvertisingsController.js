"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderAdvertisingsController = void 0;
var _OrderAdvertisingsService = require("../../services/Club/OrderAdvertisingsService");
class OrderAdvertisingsController {
  async handle(req, res) {
    const {
      advertisings
    } = req.body;
    const club_id = req.club_id;
    const orderAdvertisingsService = new _OrderAdvertisingsService.OrderAdvertisingsService();
    const advertising = await orderAdvertisingsService.execute({
      club_id,
      advertisings
    });
    return res.json(advertising);
  }
}
exports.OrderAdvertisingsController = OrderAdvertisingsController;