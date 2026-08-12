"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuyTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class BuyTournamentService {
  async execute({
    totalToken,
    totalValue,
    tournament_id
  }, tx) {
    const prisma = tx || _prisma.default;
    const tournamentGet = await prisma.tournament.findFirst({
      where: {
        id: tournament_id
      }
    });
    const tournament = await prisma.tournament.update({
      where: {
        id: tournamentGet["id"]
      },
      data: {
        total_tokens: tournamentGet.total_tokens + totalToken,
        totalAward_accumulated: tournamentGet.totalAward_accumulated + totalValue
      },
      include: {
        clients: {
          orderBy: {
            date_out: "desc"
          },
          include: {
            client: true,
            purchases: true
          }
        },
        purchases: true,
        clients_purchases: true,
        vacancys: {
          include: {
            client: true
          }
        },
        rankings: true
      }
    });
    return tournament;
  }
}
exports.BuyTournamentService = BuyTournamentService;