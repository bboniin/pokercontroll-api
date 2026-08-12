"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExitClientTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ExitClientTournamentService {
  async execute({
    client_id,
    tournament_id,
    position
  }) {
    if (!client_id || !tournament_id) {
      throw new Error("Id do cliente e do torneio são obrigatórios");
    }
    const tournamentGet = await _prisma.default.tournament.findUnique({
      where: {
        id: tournament_id
      },
      include: {
        clients: true
      }
    });
    if (!tournamentGet) {
      throw new Error("Torneio não foi encontrado");
    }
    const chairClient = await _prisma.default.clientTournament.findFirst({
      where: {
        client_id: client_id,
        tournament_id: tournament_id,
        chair_tournament: {
          contains: "T"
        }
      }
    });
    if (!chairClient) {
      throw new Error("Cliente não foi encontrado");
    }
    const award = position ? parseFloat(tournamentGet.award.split("-")[position - 1]) : 0;
    await _prisma.default.clientTournament.update({
      where: {
        id: chairClient.id
      },
      data: {
        date_out: new Date(),
        exit: true,
        position: position || 9999,
        award: award || 0,
        chair_tournament: ""
      }
    });
    const tournament = await _prisma.default.tournament.findUnique({
      where: {
        id: tournament_id
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
    return {
      tournament,
      award: award
    };
  }
}
exports.ExitClientTournamentService = ExitClientTournamentService;