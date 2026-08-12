"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetClubController = void 0;
var _GetClubService = require("../../services/Club/GetClubService");
class GetClubController {
  async handle(req, res) {
    const club_id = req.club_id;
    const getClubService = new _GetClubService.GetClubService();
    const club = await getClubService.execute({
      club_id
    });
    if (club["photo"]) {
      club["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + club["photo"];
    }
    if (club["background_image"]) {
      club["background_image_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + club["background_image"];
    }
    return res.json(club);
  }
}
exports.GetClubController = GetClubController;