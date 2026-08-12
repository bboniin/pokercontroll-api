"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewPurchaseTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class NewPurchaseTournamentService {
  async execute({
    name,
    cashier,
    value,
    max_limit,
    token,
    value_staff,
    type,
    token_staff,
    multiple,
    club_id,
    is_staff,
    tournament_id
  }) {
    if (!club_id || !tournament_id) {
      throw new Error("Envie o id do clube e do torneio");
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
    if (!name || !cashier || type != "service" && !token || is_staff && !token_staff) {
      throw new Error("Preencha todos os campos para adicionar nova compra");
    }
    const purchase = await _prisma.default.purchase.findFirst({
      where: {
        name: name,
        tournament_id: tournament.id
      }
    });
    if (purchase) {
      throw new Error("Compra já criada com esse nome");
    }
    await _prisma.default.purchase.create({
      data: {
        name: name,
        cashier: cashier,
        value: value || 0,
        max_limit: max_limit || 0,
        token: token,
        type: type,
        value_staff: value_staff || 0,
        token_staff: token_staff || 0,
        multiple: multiple || false,
        is_staff: is_staff || false,
        tournament_id: tournament.id
      }
    });
    return tournament;
  }
}
exports.NewPurchaseTournamentService = NewPurchaseTournamentService;