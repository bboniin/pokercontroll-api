"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCommandsController = void 0;
var _ListCommandsService = require("../../services/Order/ListCommandsService");
class ListCommandsController {
  async handle(req, res) {
    let {
      page
    } = req.query;
    let club_id = req.club_id;
    const listCommandsService = new _ListCommandsService.ListCommandsService();
    const {
      commands,
      commandsTotal
    } = await listCommandsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0
    });
    commands.map(command => {
      if (command["client"]["photo"]) {
        command["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + command["client"]["photo"];
      }
    });
    return res.json({
      commands,
      commandsTotal
    });
  }
}
exports.ListCommandsController = ListCommandsController;