"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndRegisterTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EndRegisterTournamentService {
  async execute({
    tournament_id,
    club_id,
    award,
    staff
  }) {
    const tournament = await _prisma.default.tournament.findFirst({
      where: {
        club_id: club_id,
        id: tournament_id,
        OR: [{
          status: "inscricao"
        }, {
          status: "final"
        }]
      }
    });
    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }
    if (tournament.type != "classificatorio" && !award) {
      throw new Error("Modelo de recompensa é obrigátorio");
    }
    const tournamentC = await _prisma.default.tournament.update({
      where: {
        id: tournament_id
      },
      data: {
        status: "final",
        award: award,
        staff: staff
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
    Promise.all(await tournamentC.rankings.map(async item => {
      if (item.type == "percentage") {
        item = await _prisma.default.tournamentRanking.update({
          where: {
            id: item.id
          },
          data: {
            value: tournamentC.totalAward_accumulated * (item.percentage / 100)
          }
        });
      }
    }));
    return tournamentC;
  }
}
exports.EndRegisterTournamentService = EndRegisterTournamentService;