"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListChipsAuditController = void 0;
var _ListChipsAuditService = require("../../services/Chip/ListChipsAuditService");
class ListChipsAuditController {
  async handle(req, res) {
    const {
      cash_id
    } = req.params;
    let club_id = req.club_id;
    const listChipsAuditService = new _ListChipsAuditService.ListChipsAuditService();
    const chips = await listChipsAuditService.execute({
      club_id,
      cash_id
    });
    return res.json(chips);
  }
}
exports.ListChipsAuditController = ListChipsAuditController;