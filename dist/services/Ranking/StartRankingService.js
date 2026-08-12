"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StartRankingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class StartRankingService {
  async execute({
    ranking_id,
    club_id
  }) {
    if (!ranking_id || !club_id) {
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
    if (ranking.status != "criado") {
      throw new Error("Ranking já iniciado encontrado");
    }
    const rankingEdit = await _prisma.default.ranking.update({
      where: {
        id: ranking_id
      },
      data: {
        status: "andamento"
      }
    });
    return rankingEdit;
  }
}
exports.StartRankingService = StartRankingService;