"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditTournamentService {
  async execute({
    name,
    club_id,
    value,
    photo,
    amount,
    tournament_id
  }) {
    if (!tournament_id || !value || !name || !amount || !club_id) {
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
    let data = {
      name: name,
      value: value,
      amount: amount
    };
    if (photo) {
      const s3Storage = new _S3Storage.default();
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }
    const tournamentEdit = await _prisma.default.tournament.update({
      where: {
        id: tournament_id
      },
      data: data,
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
exports.EditTournamentService = EditTournamentService;