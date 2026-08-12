"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteClubService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteClubService {
  async execute({
    club_id,
    user_id
  }) {
    const club = await _prisma.default.club.delete({
      where: {
        id: club_id
      }
    });
    return club;
  }
}
exports.DeleteClubService = DeleteClubService;