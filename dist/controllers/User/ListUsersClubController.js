"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListUsersClubController = void 0;
var _ListUsersClubService = require("../../services/User/ListUsersClubService");
class ListUsersClubController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listUsersClubService = new _ListUsersClubService.ListUsersClubService();
    const user = await listUsersClubService.execute({
      club_id
    });
    if (user["photo"]) {
      user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }
    return res.json(user);
  }
}
exports.ListUsersClubController = ListUsersClubController;