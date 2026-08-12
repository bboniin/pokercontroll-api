"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeletePurchaseTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeletePurchaseTournamentService {
  async execute({
    purchase_id,
    club_id
  }) {
    if (!club_id || !purchase_id) {
      throw new Error("Envie o id do clube e da compra");
    }
    const purchase = await _prisma.default.purchase.findFirst({
      where: {
        id: purchase_id
      },
      include: {
        tournament: true
      }
    });
    if (!purchase) {
      throw new Error("Compra não encontrada");
    }
    if (purchase.tournament.club_id !== club_id) {
      throw new Error("Não autorizado");
    }
    await _prisma.default.purchase.delete({
      where: {
        id: purchase_id
      }
    });
    return {
      message: "Compra excluída com sucesso"
    };
  }
}
exports.DeletePurchaseTournamentService = DeletePurchaseTournamentService;