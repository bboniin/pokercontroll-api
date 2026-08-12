"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateRakeController = void 0;
var _CreateRakeService = require("../../services/Cash/CreateRakeService");
class CreateRakeController {
  async handle(req, res) {
    const {
      value
    } = req.body;
    const {
      id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const createRakeService = new _CreateRakeService.CreateRakeService();
    const rake = await createRakeService.execute({
      club_id,
      user_id,
      id,
      value
    });
    return res.json(rake);
  }
}
exports.CreateRakeController = CreateRakeController;