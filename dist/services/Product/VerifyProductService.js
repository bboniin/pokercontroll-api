"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyProductService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class VerifyProductService {
  async execute({
    items
  }) {
    if (!items) {
      throw new Error("Nenhum produto foi adicionado");
    }
    let error = "";
    items.map(async data => {
      const itemOrder = await _prisma.default.product.findFirst({
        where: {
          id: data["id"],
          amount: {
            gte: data["amount"]
          }
        }
      });
      if (!itemOrder && !error) {
        error = `Produto \"${data["name"]}\" não tem estoque suficiente`;
      }
    });
    if (error) {
      throw new Error(error);
    }
    return true;
  }
}
exports.VerifyProductService = VerifyProductService;