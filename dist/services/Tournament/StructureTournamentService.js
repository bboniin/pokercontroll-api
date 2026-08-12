"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StructureTournamentService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditTournamentService {} // placeholder if needed

class StructureTournamentService {
  async execute({
    club_id,
    name,
    intervals,
    nivel_max_in,
    nivel_max_timechip,
    seconds_ajusted,
    blinds,
    tournament_id,
    target_tournament_id
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
      throw new Error("Torneio não encontrado");
    }
    const dataToUpdate = {};
    if (name !== undefined) {
      dataToUpdate.name = name;
    }
    if (blinds !== undefined) {
      dataToUpdate.blinds = blinds;
    }
    if (intervals !== undefined) {
      dataToUpdate.intervals = intervals;
    }
    if (nivel_max_in !== undefined) {
      dataToUpdate.max_in = nivel_max_in;
    }
    if (nivel_max_timechip !== undefined) {
      dataToUpdate.max_timechip = nivel_max_timechip;
    }
    if (seconds_ajusted !== undefined) {
      dataToUpdate.seconds_ajusted = seconds_ajusted;
    }
    if (target_tournament_id !== undefined) {
      dataToUpdate.classified_tournament_id = target_tournament_id;
    }
    const finalIntervals = intervals !== undefined ? intervals : tournament.intervals;
    const finalNivelMaxIn = nivel_max_in !== undefined ? nivel_max_in : tournament.max_in;
    const finalNivelMaxTimechip = nivel_max_timechip !== undefined ? nivel_max_timechip : tournament.max_timechip;
    if (finalIntervals) {
      let minsTimechip = 0;
      let minsIn = 0;
      finalIntervals.split("-").map((item, index) => {
        if (index < finalNivelMaxIn) {
          minsIn += parseInt(item.substring(1)) || 0;
        }
        if (index < finalNivelMaxTimechip) {
          minsTimechip += parseInt(item.substring(1)) || 0;
        }
      });
      dataToUpdate.datetime_max_in = (0, _dateFns.addMinutes)(new Date(tournament.datetime_initial), minsIn);
      dataToUpdate.datetime_max_timechip = (0, _dateFns.addMinutes)(new Date(tournament.datetime_initial), minsTimechip);
    }
    const tournamentEdit = await _prisma.default.tournament.update({
      where: {
        id: tournament_id
      },
      data: dataToUpdate
    });
    return tournamentEdit;
  }
}
exports.StructureTournamentService = StructureTournamentService;