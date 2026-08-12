"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTransactionsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListTransactionsService {
  async execute({
    club_id,
    page,
    filter
  }) {
    if (!filter) {
      filter = {};
    }
    const transactionsTotal = await _prisma.default.transaction.count({
      where: {
        ...filter,
        club_id: club_id
      }
    });
    const transactionsTotalReceive = await _prisma.default.transaction.findMany({
      where: {
        operation: "entrada",
        paid: false,
        club_id: club_id
      }
    });
    const transactionsTotalDebt = await _prisma.default.transaction.findMany({
      where: {
        operation: "saida",
        paid: false,
        club_id: club_id
      }
    });
    const club = await _prisma.default.club.findUnique({
      where: {
        id: club_id
      },
      include: {
        transactions: {
          skip: page * 30,
          take: 30,
          where: {
            ...filter
          },
          orderBy: {
            create_at: "desc"
          },
          include: {
            methods_transaction: true,
            items_transaction: true,
            client: true
          }
        }
      }
    });
    club["transactionsTotal"] = transactionsTotal;
    club["transactionsTotalReceive"] = transactionsTotalReceive.length ? transactionsTotalReceive.map(prod => prod.value - prod.value_paid).reduce((total, preco) => total + preco) : 0;
    club["transactionsTotalDebt"] = transactionsTotalDebt.length ? transactionsTotalDebt.map(prod => prod.value - prod.value_paid).reduce((total, preco) => total + preco) : 0;
    return club;
  }
}
exports.ListTransactionsService = ListTransactionsService;