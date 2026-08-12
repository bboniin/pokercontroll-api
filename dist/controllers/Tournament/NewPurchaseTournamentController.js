"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewPurchaseTournamentController = void 0;
var _NewPurchaseTournamentService = require("../../services/Tournament/NewPurchaseTournamentService");
class NewPurchaseTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      name,
      cashier,
      value,
      max_limit,
      token,
      value_staff,
      type,
      token_staff,
      multiple,
      is_staff
    } = req.body;
    let club_id = req.club_id;
    const newPurchaseTournamentService = new _NewPurchaseTournamentService.NewPurchaseTournamentService();
    const tournament = await newPurchaseTournamentService.execute({
      tournament_id,
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
      is_staff
    });
    return res.json(tournament);
  }
}
exports.NewPurchaseTournamentController = NewPurchaseTournamentController;