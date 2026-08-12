"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditRakeController = void 0;
var _EditRakeService = require("../../services/Cash/EditRakeService");
class EditRakeController {
  async handle(req, res) {
    const {
      value
    } = req.body;
    const {
      id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const editRakeService = new _EditRakeService.EditRakeService();
    const rake = await editRakeService.execute({
      club_id,
      user_id,
      id,
      value
    });
    return res.json(rake);
  }
}
exports.EditRakeController = EditRakeController;