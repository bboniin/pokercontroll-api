"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditProductController = void 0;
var _EditProductService = require("../../services/Product/EditProductService");
class EditProductController {
  async handle(req, res) {
    const {
      product_id
    } = req.params;
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
    const editProductService = new _EditProductService.EditProductService();
    const product = await editProductService.execute({
      name,
      value: value ? parseFloat(value) : 0,
      cost_value: cost_value ? parseFloat(cost_value) : 0,
      category_id,
      photo,
      club_id,
      product_id
    });
    if (product["photo"]) {
      product["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + product["photo"];
    }
    return res.json(product);
  }
}
exports.EditProductController = EditProductController;