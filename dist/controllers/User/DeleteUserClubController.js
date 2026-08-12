"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteUserClubController = void 0;
var _DeleteUserClubService = require("../../services/User/DeleteUserClubService");
class DeleteUserClubController {
  async handle(req, res) {
    const {
      user_id
    } = req.params;
    const deleteUserClubService = new _DeleteUserClubService.DeleteUserClubService();
    const user = await deleteUserClubService.execute({
      user_id
    });
    if (user["photo"]) {
      user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }
    return res.json(user);
  }
}
exports.DeleteUserClubController = DeleteUserClubController;