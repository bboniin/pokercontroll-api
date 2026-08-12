"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitialTournamentService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class InitialTournamentService {
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
    let minsTimechip = 0;
    let minsIn = 0;
    tournament.intervals.split("-").map((item, index) => {
      if (index < tournament.max_in) {
        minsIn += parseInt(item.substring(1));
      }
      if (index < tournament.max_timechip) {
        minsTimechip += parseInt(item.substring(1));
      }
    });
    const tournamentC = await _prisma.default.tournament.update({
      where: {
        id: tournament_id
      },
      data: {
        status: "inscricao",
        datetime_initial: new Date(),
        datetime_max_in: (0, _dateFns.addMinutes)(new Date(), minsIn),
        datetime_max_timechip: (0, _dateFns.addMinutes)(new Date(), minsTimechip)
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
exports.InitialTournamentService = InitialTournamentService;