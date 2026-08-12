"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteProductController = void 0;
var _DeleteProductService = require("../../services/Product/DeleteProductService");
class DeleteProductController {
  async handle(req, res) {
    const {
      product_id
    } = req.params;
    let club_id = req.club_id;
    const deleteProductService = new _DeleteProductService.DeleteProductService();
    const product = await deleteProductService.execute({
      club_id,
      product_id
    });
    return res.json(product);
  }
}
exports.DeleteProductController = DeleteProductController;