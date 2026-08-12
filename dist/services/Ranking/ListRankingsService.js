"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListRankingsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListRankingsService {
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
    const rankingsTotal = await _prisma.default.ranking.count({
      where: {
        club_id: club_id
      }
    });
    const rankings = await _prisma.default.ranking.findMany({
      ...filter,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      },
      include: {
        clients_points: true,
        tournaments: true
      }
    });
    rankings.map(data => {
      data["accumulated_value"] = data.tournaments.reduce((acc, item) => acc + item.value, 0);
    });
    return {
      rankings,
      rankingsTotal
    };
  }
}
exports.ListRankingsService = ListRankingsService;