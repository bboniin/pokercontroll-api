"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetOrderController = void 0;
var _GetOrderService = require("../../services/Order/GetOrderService");
class GetOrderController {
  async handle(req, res) {
    const {
      order_id
    } = req.params;
    let club_id = req.club_id;
    const getOrderService = new _GetOrderService.GetOrderService();
    const order = await getOrderService.execute({
      club_id,
      order_id
    });
    if (order["client"]["photo"]) {
      order["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
    }
    return res.json(order);
  }
}
exports.GetOrderController = GetOrderController;