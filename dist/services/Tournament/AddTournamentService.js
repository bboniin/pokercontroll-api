"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AddTournamentService {
  async execute({
    client_id,
    chair,
    tournament_id,
    tokenTimechip,
    verify
  }, tx) {
    const prisma = tx || _prisma.default;
    if (!client_id || !tournament_id) {
      throw new Error("Id do cliente, do torneio e posição na mesa são obrigatórios");
    }
    if (chair) {
      const chairClient = await prisma.clientTournament.findFirst({
        where: {
          tournament_id: tournament_id,
          chair_tournament: "T" + chair,
          exit: false
        }
      });
      if (chairClient) {
        throw new Error("Posição já está sendo ocupada");
      }
    }
    const clientTournamentGet = await prisma.clientTournament.findFirst({
      where: {
        client_id: client_id,
        tournament_id: tournament_id
      }
    });
    if (clientTournamentGet) {
      if (clientTournamentGet.exit) {
        if (verify) {
          return true;
        } else {
          const client = await prisma.clientTournament.update({
            where: {
              id: clientTournamentGet.id
            },
            data: {
              client_id: client_id,
              tournament_id: tournament_id,
              award: 0,
              chair_tournament: chair ? "T" + chair : "",
              timechip: tokenTimechip,
              exit: false
            }
          });
          return client;
        }
      } else {
        throw new Error("Cliente já está participando desse torneio");
      }
    } else {
      if (verify) {
        return true;
      } else {
        const client = await prisma.clientTournament.create({
          data: {
            client_id: client_id,
            tournament_id: tournament_id,
            timechip: tokenTimechip || 0,
            award: 0,
            chair_tournament: chair ? "T" + chair : ""
          }
        });
        return client;
      }
    }
  }
}
exports.AddTournamentService = AddTournamentService;