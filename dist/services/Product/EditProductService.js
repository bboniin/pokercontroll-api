"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditProductService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditProductService {
  async execute({
    name,
    club_id,
    cost_value,
    value,
    category_id,
    photo,
    product_id
  }) {
    if (!product_id || !value || !name || !category_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const product = await _prisma.default.product.findFirst({
      where: {
        id: product_id,
        club_id: club_id
      }
    });
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    let data = {
      name: name,
      value: value,
      category_id: category_id,
      cost_value: cost_value
    };
    if (photo) {
      const s3Storage = new _S3Storage.default();
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }
    const productEdit = await _prisma.default.product.update({
      where: {
        id: product_id
      },
      data: data
    });
    return productEdit;
  }
}
exports.EditProductService = EditProductService;