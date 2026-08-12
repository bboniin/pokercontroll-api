"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditClubController = void 0;
var _EditClubService = require("../../services/Club/EditClubService");
class EditClubController {
  async handle(req, res) {
    const {
      primary_color,
      font_color,
      background_color,
      logo_tournament,
      border_tournament,
      delete_background,
      delete_photo
    } = req.body;
    let photo = "";
    let background_image = "";
    const files = req.files;
    if (files?.photo?.[0]) {
      photo = files.photo[0].filename;
    }
    if (files?.background_image?.[0]) {
      background_image = files.background_image[0].filename;
    }
    const club_id = req.club_id;
    const editClubService = new _EditClubService.EditClubService();
    const club = await editClubService.execute({
      club_id,
      primary_color,
      font_color,
      background_color,
      background_image,
      logo_tournament: logo_tournament == "true",
      border_tournament: border_tournament == "true",
      photo,
      delete_background,
      delete_photo
    });
    return res.json(club);
  }
}
exports.EditClubController = EditClubController;