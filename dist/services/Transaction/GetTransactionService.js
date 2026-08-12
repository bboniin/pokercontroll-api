"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTransactionService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetTransactionService {
  async execute({
    id
  }) {
    if (!id) {
      throw new Error("id da cobrança é obrigatório");
    }
    const transaction = await _prisma.default.transaction.findFirst({
      where: {
        id: id
      },
      include: {
        methods_transaction: true
      }
    });
    if (!transaction) {
      throw new Error("Transação não encontrada");
    }
    return transaction;
  }
}
exports.GetTransactionService = GetTransactionService;