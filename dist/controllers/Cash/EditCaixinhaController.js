"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCaixinhaController = void 0;
var _EditCaixinhaService = require("../../services/Cash/EditCaixinhaService");
class EditCaixinhaController {
  async handle(req, res) {
    const {
      value,
      observation
    } = req.body;
    const {
      id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const editCaixinhaService = new _EditCaixinhaService.EditCaixinhaService();
    const caixinha = await editCaixinhaService.execute({
      club_id,
      user_id,
      id,
      value,
      observation
    });
    return res.json(caixinha);
  }
}
exports.EditCaixinhaController = EditCaixinhaController;