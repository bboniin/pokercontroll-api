"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateProductController = void 0;
var _CreateProductService = require("../../services/Product/CreateProductService");
class CreateProductController {
  async handle(req, res) {
    const {
      name,
      value,
      category_id,
      cost_value
    } = req.body;
    let photo = "";
    if (req.file) {
      photo = req.file.filename;
    }
    let club_id = req.club_id;
    const createProductService = new _CreateProductService.CreateProductService();
    const product = await createProductService.execute({
      name,
      category_id,
      cost_value: cost_value ? parseFloat(cost_value) : 0,
      value: value ? parseFloat(value) : 0,
      photo,
      club_id
    });
    if (product["photo"]) {
      product["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + product["photo"];
    }
    return res.json(product);
  }
}
exports.CreateProductController = CreateProductController;