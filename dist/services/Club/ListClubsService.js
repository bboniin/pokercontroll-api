"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClubsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListClubsService {
  async execute({
    user_id,
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
    const clubsTotal = await _prisma.default.club.count();
    const clubs = await _prisma.default.club.findMany({
      ...filter,
      skip: page * 30,
      take: 30,
      orderBy: {
        create_at: "asc"
      }
    });
    return all ? clubs : {
      clubs,
      clubsTotal
    };
  }
}
exports.ListClubsService = ListClubsService;