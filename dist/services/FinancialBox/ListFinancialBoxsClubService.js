"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListFinancialBoxsClubService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListFinancialBoxsClubService {
  async execute({
    club_id,
    page,
    all,
    user_id,
    admin_id
  }) {
    let filter = {};
    if (!all) {
      filter = {
        skip: page * 30,
        take: 30
      };
    }
    const admin = await _prisma.default.user.findFirst({
      where: {
        id: admin_id,
        type: "admin"
      }
    });
    if (!admin) {
      throw new Error("Rota restrira para administrador");
    }
    const financialBoxsTotal = await _prisma.default.financialBox.count({
      where: {
        club_id: club_id,
        ...(user_id && {
          user_id: user_id
        })
      }
    });
    const financialBoxs = await _prisma.default.financialBox.findMany({
      ...filter,
      where: {
        club_id: club_id,
        ...(user_id && {
          user_id: user_id
        })
      },
      orderBy: {
        date_end: "desc"
      },
      include: {
        user: true
      }
    });
    return {
      financialBoxs,
      financialBoxsTotal
    };
  }
}
exports.ListFinancialBoxsClubService = ListFinancialBoxsClubService;