"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTransactionsBankService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListTransactionsBankService {
  async execute({
    bank_id,
    page,
    all
  }) {
    let filter = {};
    if (!all) {
      filter = {
        skip: page * 30,
        take: 30
      };
    }
    const transactionsTotal = await _prisma.default.transactionBank.count({
      where: {
        bank_id: bank_id
      }
    });
    const transactions = await _prisma.default.transactionBank.findMany({
      ...filter,
      where: {
        bank_id: bank_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return all ? transactions : {
      transactions,
      transactionsTotal
    };
  }
}
exports.ListTransactionsBankService = ListTransactionsBankService;