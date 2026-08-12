"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteProductService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteProductService {
  async execute({
    product_id,
    club_id
  }) {
    const productGet = await _prisma.default.product.findFirst({
      where: {
        id: product_id,
        club_id
      }
    });
    if (!productGet) {
      throw new Error("Produto não encontrado");
    }
    const product = await _prisma.default.product.delete({
      where: {
        id: product_id
      }
    });
    if (product.photo) {
      const s3Storage = new _S3Storage.default();
      await s3Storage.deleteFile(product.photo);
    }
    return product;
  }
}
exports.DeleteProductService = DeleteProductService;