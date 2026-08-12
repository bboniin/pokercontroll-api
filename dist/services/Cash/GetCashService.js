"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetCashService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetCashService {
  async execute({
    club_id,
    cash_id
  }) {
    const cash = await _prisma.default.cash.findFirst({
      where: {
        id: cash_id,
        club_id: club_id
      },
      include: {
        rakes: true,
        boxs: true
      }
    });
    if (!cash) {
      throw new Error("Sessão cash não encontrada");
    }
    const transactions = await _prisma.default.transaction.findMany({
      where: {
        sector_id: cash.id
      },
      include: {
        client: true,
        methods_transaction: true
      }
    });
    const {
      total_entrie,
      total_out
    } = transactions.reduce((acc, item) => {
      if (item.operation === "entrada") {
        acc.total_entrie += item.value;
      } else {
        acc.total_out += item.value;
      }
      return acc;
    }, {
      total_entrie: 0,
      total_out: 0
    });
    const rake = cash.rakes.reduce((acc, item) => acc + item.value, 0);
    const caixinha = cash.boxs.reduce((acc, item) => acc + item.value, 0);
    cash["transactions"] = transactions;
    cash["total_entrie"] = total_entrie;
    cash["total_out"] = total_out;
    cash["rake"] = rake;
    cash["caixinha"] = caixinha;
    return cash;
  }
}
exports.GetCashService = GetCashService;