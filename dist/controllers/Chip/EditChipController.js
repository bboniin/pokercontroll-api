"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditChipController = void 0;
var _EditChipService = require("../../services/Chip/EditChipService");
class EditChipController {
  async handle(req, res) {
    const {
      chip_id
    } = req.params;
    const {
      color,
      value
    } = req.body;
    let club_id = req.club_id;
    const editChipService = new _EditChipService.EditChipService();
    const chip = await editChipService.execute({
      color,
      value,
      club_id,
      chip_id
    });
    return res.json(chip);
  }
}
exports.EditChipController = EditChipController;