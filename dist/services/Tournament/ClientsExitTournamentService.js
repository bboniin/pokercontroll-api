"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientsExitTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ClientsExitTournamentService {
  async execute({
    club_id,
    tournament_id
  }) {
    const clients = await _prisma.default.client.findMany({
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      },
      include: {
        client_tournaments: {
          where: {
            tournament_id: tournament_id,
            exit: true
          },
          include: {
            client: true,
            purchases: true
          }
        }
      }
    });
    let clientsC = [];
    clients.map(item => {
      if (item.client_tournaments.length) {
        clientsC.push({
          ...item,
          chair: item.client_tournaments[0].chair_tournament
        });
      }
    });
    return clientsC;
  }
}
exports.ClientsExitTournamentService = ClientsExitTournamentService;