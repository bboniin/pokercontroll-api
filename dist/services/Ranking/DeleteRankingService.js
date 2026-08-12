"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteRankingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteRankingService {
  async execute({
    ranking_id,
    club_id
  }) {
    const ranking = await _prisma.default.ranking.findFirst({
      where: {
        id: ranking_id,
        club_id: club_id
      }
    });
    if (!ranking) {
      throw new Error("Ranking não encontrado");
    }
    await _prisma.default.ranking.delete({
      where: {
        id: ranking_id
      }
    });
    return ranking;
  }
}
exports.DeleteRankingService = DeleteRankingService;