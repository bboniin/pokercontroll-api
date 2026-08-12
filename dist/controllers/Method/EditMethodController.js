"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditMethodController = void 0;
var _EditMethodService = require("../../services/Method/EditMethodService");
class EditMethodController {
  async handle(req, res) {
    const {
      method_id
    } = req.params;
    const {
      name,
      percentage,
      identifier
    } = req.body;
    let club_id = req.club_id;
    const editMethodService = new _EditMethodService.EditMethodService();
    const method = await editMethodService.execute({
      name,
      percentage: percentage ? parseFloat(percentage) : 0,
      identifier,
      club_id,
      method_id
    });
    return res.json(method);
  }
}
exports.EditMethodController = EditMethodController;