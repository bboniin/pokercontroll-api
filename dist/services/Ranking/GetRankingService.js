"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetRankingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetRankingService {
  async execute({
    ranking_id,
    club_id
  }) {
    const ranking = await _prisma.default.ranking.findFirst({
      where: {
        id: ranking_id,
        club_id: club_id
      },
      include: {
        clients_points: {
          include: {
            client: true
          }
        },
        tournaments: true
      }
    });
    if (!ranking) {
      throw new Error("Ranking  não encontrado");
    }
    let clientPoints = [];
    ranking["accumulated_value"] = ranking.tournaments.reduce((acc, item) => acc + item.value, 0);
    ranking.clients_points.map(item => {
      const indexClient = clientPoints.findIndex(client => client.client_id == item.client_id);
      if (indexClient > -1) {
        clientPoints[indexClient].points += item.points;
      } else {
        clientPoints.push(item);
      }
    });
    ranking.clients_points = clientPoints;
    return ranking;
  }
}
exports.GetRankingService = GetRankingService;