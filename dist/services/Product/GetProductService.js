"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetProductService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetProductService {
  async execute({
    id,
    club_id
  }) {
    if (!id || !club_id) {
      throw new Error("Envie o id do produto e do clube");
    }
    const product = await _prisma.default.product.findFirst({
      where: {
        id: id,
        club_id: club_id
      },
      include: {
        category: true
      }
    });
    return product;
  }
}
exports.GetProductService = GetProductService;