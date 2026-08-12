"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListAdvertisingsController = void 0;
var _ListAdvertisingsService = require("../../services/Club/ListAdvertisingsService");
class ListAdvertisingsController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listAdvertisingsService = new _ListAdvertisingsService.ListAdvertisingsService();
    const advertisings = await listAdvertisingsService.execute({
      club_id
    });
    advertisings.map(item => {
      if (item["file"]) {
        item["file_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["file"];
      }
    });
    return res.json(advertisings);
  }
}
exports.ListAdvertisingsController = ListAdvertisingsController;