"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListOrdersController = void 0;
var _ListOrdersService = require("../../services/Order/ListOrdersService");
class ListOrdersController {
  async handle(req, res) {
    let {
      page
    } = req.query;
    let club_id = req.club_id;
    const listOrdersService = new _ListOrdersService.ListOrdersService();
    const {
      orders,
      ordersTotal
    } = await listOrdersService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0
    });
    orders.map(order => {
      if (order["client"]["photo"]) {
        order["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
      }
    });
    return res.json({
      orders,
      ordersTotal
    });
  }
}
exports.ListOrdersController = ListOrdersController;