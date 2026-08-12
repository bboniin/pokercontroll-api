"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PausedTournamentService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class PausedTournamentService {
  async execute({
    club_id,
    tournament_id
  }) {
    if (!tournament_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const tournament = await _prisma.default.tournament.findFirst({
      where: {
        id: tournament_id,
        club_id: club_id
      }
    });
    if (!tournament) {
      throw new Error("Produto não encontrado");
    }
    if (tournament.paused) {
      const tournamentEdit = await _prisma.default.tournament.update({
        where: {
          id: tournament_id
        },
        data: {
          paused: false,
          seconds_paused: tournament.seconds_paused + (0, _dateFns.differenceInSeconds)(new Date(), new Date(tournament.time_paused))
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
      return tournamentEdit;
    } else {
      const tournamentEdit = await _prisma.default.tournament.update({
        where: {
          id: tournament_id
        },
        data: {
          paused: true,
          time_paused: new Date()
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
      return tournamentEdit;
    }
  }
}
exports.PausedTournamentService = PausedTournamentService;