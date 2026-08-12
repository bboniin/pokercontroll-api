"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderTransactionService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class OrderTransactionService {
  async execute({
    id,
    club_id,
    sector_id
  }) {
    if (!club_id || !id || !sector_id) {
      throw new Error("Id da cobrança e do clube é obrigatório");
    }
    const transactionV = await _prisma.default.transaction.findFirst({
      where: {
        id: id
      }
    });
    if (!transactionV) {
      throw new Error("Transação não encontrada");
    }
    const transaction = await _prisma.default.transaction.update({
      where: {
        id: id
      },
      data: {
        sector_id: sector_id
      }
    });
    return transaction;
  }
}
exports.OrderTransactionService = OrderTransactionService;