"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListJackpotService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListJackpotService {
  async execute({
    club_id,
    page
  }) {
    const transactionsTotal = await _prisma.default.transaction.count({
      where: {
        club_id: club_id,
        type: "jackpot"
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
            type: "jackpot"
          },
          orderBy: {
            create_at: "desc"
          },
          include: {
            methods_transaction: true,
            items_transaction: true
          }
        }
      }
    });
    club["transactionsTotal"] = transactionsTotal;
    return club;
  }
}
exports.ListJackpotService = ListJackpotService;