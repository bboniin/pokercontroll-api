"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateProductService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateProductService {
  async execute({
    name,
    club_id,
    cost_value,
    category_id,
    value,
    photo
  }) {
    if (!value || !name || !category_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    let data = {
      name: name,
      value: value,
      amount: 0,
      category_id: category_id,
      cost_value: cost_value,
      club_id: club_id
    };
    if (photo) {
      const s3Storage = new _S3Storage.default();
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }
    const product = await _prisma.default.product.create({
      data: data
    });
    return product;
  }
}
exports.CreateProductService = CreateProductService;