"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditClubService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditClubService {
  async execute({
    club_id,
    primary_color,
    font_color,
    background_color,
    photo,
    background_image,
    logo_tournament,
    border_tournament,
    delete_photo,
    delete_background
  }) {
    const s3Storage = new _S3Storage.default();
    if (delete_background) {
      await s3Storage.deleteFile(delete_background);
      background_image = "";
    }
    if (delete_photo) {
      await s3Storage.deleteFile(delete_photo);
      background_image = "";
    }
    if (background_image) {
      const upload = await s3Storage.saveFile(background_image);
      background_image = upload;
    }
    if (photo) {
      const upload = await s3Storage.saveFile(photo);
      photo = upload;
    }
    const club = await _prisma.default.club.update({
      where: {
        id: club_id
      },
      data: {
        primary_color: primary_color,
        font_color: font_color,
        background_color: background_color,
        background_image: background_image,
        photo: photo,
        logo_tournament: logo_tournament,
        border_tournament: border_tournament
      }
    });
    return club;
  }
}
exports.EditClubService = EditClubService;