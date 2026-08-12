"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateChipAuditController = void 0;
var _CreateChipAuditService = require("../../services/Chip/CreateChipAuditService");
class CreateChipAuditController {
  async handle(req, res) {
    const {
      cash_id
    } = req.params;
    const {
      chips_value,
      briefcase_value
    } = req.body;
    let club_id = req.club_id;
    const createChipAuditService = new _CreateChipAuditService.CreateChipAuditService();
    const chip = await createChipAuditService.execute({
      chips_value,
      briefcase_value,
      cash_id,
      club_id
    });
    return res.json(chip);
  }
}
exports.CreateChipAuditController = CreateChipAuditController;