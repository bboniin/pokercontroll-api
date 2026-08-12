"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetClubService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetClubService {
  async execute({
    club_id
  }) {
    const club = await _prisma.default.club.findUnique({
      where: {
        id: club_id
      }
    });
    if (!club) {
      throw new Error("Clube não encontrado");
    }
    return club;
  }
}
exports.GetClubService = GetClubService;