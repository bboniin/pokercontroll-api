"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetCommandController = void 0;
var _GetCommandService = require("../../services/Order/GetCommandService");
class GetCommandController {
  async handle(req, res) {
    const {
      command_id
    } = req.params;
    let club_id = req.club_id;
    const getCommandService = new _GetCommandService.GetCommandService();
    const command = await getCommandService.execute({
      club_id,
      command_id
    });
    if (command["client"]["photo"]) {
      command["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + command["client"]["photo"];
    }
    return res.json(command);
  }
}
exports.GetCommandController = GetCommandController;