"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyBuyTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class VerifyBuyTournamentService {
  async execute({
    client_id,
    purchases,
    tournament_id
  }) {
    const tournament = await _prisma.default.tournament.findUnique({
      where: {
        id: tournament_id
      },
      include: {
        purchases: true,
        clients_purchases: {
          where: {
            client_id: client_id
          }
        },
        clients: {
          where: {
            client_id: client_id
          }
        }
      }
    });
    if (!tournament.clients.length) {
      throw new Error("Jogador não participa desse torneio");
    }
    purchases.map(item => {
      if (item["type"] == "service") {
        const exists = tournament.clients_purchases.some(data => item["purchase_id"] === data.id);
        if (exists) {
          throw new Error(item["name"] + " já foi adquirido por esse jogador");
        }
      }
    });
    return tournament;
  }
}
exports.VerifyBuyTournamentService = VerifyBuyTournamentService;