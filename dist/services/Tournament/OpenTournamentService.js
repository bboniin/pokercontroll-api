"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class OpenTournamentService {
  async execute({
    tournament_id,
    club_id
  }) {
    const tournament = await _prisma.default.tournament.findFirst({
      where: {
        club_id: club_id,
        id: tournament_id
      }
    });
    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }
    const tournamentC = await _prisma.default.tournament.update({
      where: {
        id: tournament_id
      },
      data: {
        status: "aberto"
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
    return tournamentC;
  }
}
exports.OpenTournamentService = OpenTournamentService;