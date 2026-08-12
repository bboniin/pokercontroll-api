"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClosedCommandController = void 0;
var _ClosedCommandService = require("../../services/Order/ClosedCommandService");
class ClosedCommandController {
  async handle(req, res) {
    const {
      command_id
    } = req.params;
    let club_id = req.club_id;
    const closedCommandService = new _ClosedCommandService.ClosedCommandService();
    const command = await closedCommandService.execute({
      club_id,
      command_id
    });
    return res.json(command);
  }
}
exports.ClosedCommandController = ClosedCommandController;