"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeletePurchaseTournamentController = void 0;
var _DeletePurchaseTournamentService = require("../../services/Tournament/DeletePurchaseTournamentService");
class DeletePurchaseTournamentController {
  async handle(req, res) {
    const {
      purchase_id
    } = req.params;
    let club_id = req.club_id;
    const deletePurchaseTournamentService = new _DeletePurchaseTournamentService.DeletePurchaseTournamentService();
    const result = await deletePurchaseTournamentService.execute({
      purchase_id,
      club_id
    });
    return res.json(result);
  }
}
exports.DeletePurchaseTournamentController = DeletePurchaseTournamentController;