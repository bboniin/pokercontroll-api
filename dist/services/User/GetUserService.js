"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetUserService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetUserService {
  async execute({
    user_id
  }) {
    const user = await _prisma.default.user.findUnique({
      where: {
        id: user_id
      },
      select: {
        club: {
          select: {
            access_cash: true,
            access_order: true,
            access_report: true,
            access_stock: true,
            access_tournament: true,
            access_users: true
          }
        },
        id: true,
        name: true,
        email: true,
        club_id: true,
        type: true
      }
    });
    return user;
  }
}
exports.GetUserService = GetUserService;