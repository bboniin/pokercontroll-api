"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditUserClubController = void 0;
var _EditUserClubService = require("../../services/User/EditUserClubService");
class EditUserClubController {
  async handle(req, res) {
    const {
      user_id
    } = req.params;
    const {
      name,
      email,
      type,
      password
    } = req.body;
    let club_id = req.club_id;
    const editUserClubService = new _EditUserClubService.EditUserClubService();
    const user = await editUserClubService.execute({
      name,
      email,
      type,
      password,
      club_id,
      user_id
    });
    if (user["photo"]) {
      user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }
    return res.json(user);
  }
}
exports.EditUserClubController = EditUserClubController;