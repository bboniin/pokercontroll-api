"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCaixinhaController = void 0;
var _CreateCaixinhaService = require("../../services/Cash/CreateCaixinhaService");
class CreateCaixinhaController {
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
    const createCaixinhaService = new _CreateCaixinhaService.CreateCaixinhaService();
    const caixinha = await createCaixinhaService.execute({
      club_id,
      user_id,
      id,
      value,
      observation
    });
    return res.json(caixinha);
  }
}
exports.CreateCaixinhaController = CreateCaixinhaController;