"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateChipController = void 0;
var _CreateChipService = require("../../services/Chip/CreateChipService");
class CreateChipController {
  async handle(req, res) {
    const {
      color,
      value
    } = req.body;
    let club_id = req.club_id;
    const createChipService = new _CreateChipService.CreateChipService();
    const chip = await createChipService.execute({
      color,
      value,
      club_id
    });
    return res.json(chip);
  }
}
exports.CreateChipController = CreateChipController;