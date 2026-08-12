"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditTableTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditTableTournamentService {
  async execute({
    type,
    club_id,
    tournament_id
  }) {
    if (!type || !club_id || !tournament_id) {
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
    if (type == "add") {
      const tournamentEdit = await _prisma.default.tournament.update({
        where: {
          id: tournament_id
        },
        data: {
          chairs: tournament.chairs + 1
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
      const clients = await _prisma.default.clientTournament.findMany({
        where: {
          tournament_id: tournament.id,
          chair_tournament: {
            startsWith: `T${tournament.chairs}`
          }
        }
      });
      if (!clients) {
        throw new Error("Retire todos os jogadores da mesa para excluir");
      }
      const tournamentEdit = await _prisma.default.tournament.update({
        where: {
          id: tournament_id
        },
        data: {
          chairs: tournament.chairs - 1
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
exports.EditTableTournamentService = EditTableTournamentService;