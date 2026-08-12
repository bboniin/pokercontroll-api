"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteClubController = void 0;
var _DeleteClubService = require("../../services/Club/DeleteClubService");
class DeleteClubController {
  async handle(req, res) {
    const {
      club_id
    } = req.params;
    const user_id = req.user_id;
    const deleteClubService = new _DeleteClubService.DeleteClubService();
    const club = await deleteClubService.execute({
      user_id,
      club_id
    });
    return res.json(club);
  }
}
exports.DeleteClubController = DeleteClubController;