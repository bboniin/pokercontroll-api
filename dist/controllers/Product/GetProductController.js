"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetProductController = void 0;
var _GetProductService = require("../../services/Product/GetProductService");
class GetProductController {
  async handle(req, res) {
    const {
      product_id
    } = req.params;
    let club_id = req.club_id;
    const getProductService = new _GetProductService.GetProductService();
    const product = await getProductService.execute({
      id: product_id,
      club_id
    });
    if (product["photo"]) {
      product["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + product["photo"];
    }
    return res.json(product);
  }
}
exports.GetProductController = GetProductController;