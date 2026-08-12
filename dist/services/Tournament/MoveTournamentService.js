"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoveTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class MoveTournamentService {
  async execute({
    id,
    chair,
    tournament_id
  }) {
    if (!id || !tournament_id || !chair) {
      throw new Error("Id do cliente, torneio e posição na mesa é obrigatório");
    }
    const chairClient = await _prisma.default.clientTournament.findFirst({
      where: {
        tournament_id: tournament_id,
        chair_tournament: "T" + chair
      }
    });
    if (chairClient) {
      throw new Error("Posição já está sendo ocupada");
    }
    const getClient = await _prisma.default.clientTournament.findFirst({
      where: {
        tournament_id: tournament_id,
        client_id: id
      }
    });
    const client = await _prisma.default.clientTournament.update({
      where: {
        id: getClient.id
      },
      data: {
        chair_tournament: "T" + chair
      }
    });
    return client;
  }
}
exports.MoveTournamentService = MoveTournamentService;