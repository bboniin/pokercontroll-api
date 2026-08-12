"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteChipController = void 0;
var _DeleteChipService = require("../../services/Chip/DeleteChipService");
class DeleteChipController {
  async handle(req, res) {
    const {
      chip_id
    } = req.params;
    let club_id = req.club_id;
    const deleteChipService = new _DeleteChipService.DeleteChipService();
    const chip = await deleteChipService.execute({
      club_id,
      chip_id
    });
    return res.json(chip);
  }
}
exports.DeleteChipController = DeleteChipController;