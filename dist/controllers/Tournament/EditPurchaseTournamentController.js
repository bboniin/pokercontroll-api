"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditPurchaseTournamentController = void 0;
var _EditPurchaseTournamentService = require("../../services/Tournament/EditPurchaseTournamentService");
class EditPurchaseTournamentController {
  async handle(req, res) {
    const {
      purchase_id
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
    const editPurchaseTournamentService = new _EditPurchaseTournamentService.EditPurchaseTournamentService();
    const purchase = await editPurchaseTournamentService.execute({
      purchase_id,
      name,
      cashier,
      value: value ? parseFloat(value) : 0,
      max_limit: max_limit ? parseInt(max_limit) : 0,
      token: token ? parseInt(token) : 0,
      value_staff: value_staff ? parseFloat(value_staff) : 0,
      type,
      token_staff: token_staff ? parseInt(token_staff) : 0,
      multiple,
      club_id,
      is_staff
    });
    return res.json(purchase);
  }
}
exports.EditPurchaseTournamentController = EditPurchaseTournamentController;