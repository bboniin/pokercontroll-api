"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditRankingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditRankingService {
  async execute({
    name,
    ranking_id,
    goal_value,
    description,
    club_id
  }) {
    if (!name || !ranking_id || !goal_value || !description || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const ranking = await _prisma.default.ranking.findFirst({
      where: {
        id: ranking_id,
        club_id: club_id
      }
    });
    if (!ranking) {
      throw new Error("Ranking não encontrado");
    }
    const rankingEdit = await _prisma.default.ranking.update({
      where: {
        id: ranking_id
      },
      data: {
        name: name,
        description: description,
        goal_value: goal_value,
        update_at: new Date()
      }
    });
    return rankingEdit;
  }
}
exports.EditRankingService = EditRankingService;