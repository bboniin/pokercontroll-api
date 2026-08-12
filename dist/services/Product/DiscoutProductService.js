"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiscoutProductService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DiscoutProductService {
  async execute({
    items
  }) {
    if (!items) {
      throw new Error("Nenhum produto foi adicionado");
    }
    items.map(async data => {
      const product = await _prisma.default.product.findFirst({
        where: {
          id: data["id"]
        }
      });
      await _prisma.default.product.update({
        where: {
          id: data["id"]
        },
        data: {
          amount: product.amount - data["total"]
        }
      });
    });
    return true;
  }
}
exports.DiscoutProductService = DiscoutProductService;