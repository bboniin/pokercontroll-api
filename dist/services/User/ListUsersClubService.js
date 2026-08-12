"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListUsersClubService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListUsersClubService {
  async execute({
    club_id
  }) {
    const users = await _prisma.default.user.findMany({
      where: {
        club_id: club_id
      },
      select: {
        name: true,
        type: true,
        email: true,
        id: true,
        club_id: true
      }
    });
    return users;
  }
}
exports.ListUsersClubService = ListUsersClubService;