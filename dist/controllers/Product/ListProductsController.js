"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListProductsController = void 0;
var _ListProductsService = require("../../services/Product/ListProductsService");
class ListProductsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    const listProductsService = new _ListProductsService.ListProductsService();
    const {
      products,
      productsTotal
    } = await listProductsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    products.map(item => {
      if (item["photo"]) {
        item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
      }
    });
    return res.json({
      products,
      productsTotal
    });
  }
}
exports.ListProductsController = ListProductsController;