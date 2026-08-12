"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCashsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListCashsService {
  async execute({
    club_id,
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
    const cashsTotal = await _prisma.default.cash.count({
      where: {
        club_id: club_id
      }
    });
    const cashs = await _prisma.default.cash.findMany({
      ...filter,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "desc"
      }
    });
    return {
      cashs,
      cashsTotal
    };
  }
}
exports.ListCashsService = ListCashsService;