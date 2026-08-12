"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTransactionsPendingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListTransactionsPendingService {
  async execute({
    club_id,
    client_id
  }) {
    const transactions = await _prisma.default.transaction.findMany({
      where: {
        club_id: club_id,
        client_id: client_id,
        paid: false,
        operation: "entrada"
      },
      orderBy: {
        create_at: "asc"
      },
      include: {
        methods_transaction: true,
        items_transaction: true
      }
    });
    if (transactions.length == 0) {
      throw new Error("Nenhuma transação encontrada");
    }
    const total = transactions.reduce((acumulador, object) => {
      return acumulador + (object.value - object.value_paid);
    }, 0);
    return {
      transactions,
      total
    };
  }
}
exports.ListTransactionsPendingService = ListTransactionsPendingService;