"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateAdvertisingController = void 0;
var _CreateAdvertisingService = require("../../services/Club/CreateAdvertisingService");
class CreateAdvertisingController {
  async handle(req, res) {
    let file = "";
    if (req.file) {
      file = req.file.filename;
    }
    const club_id = req.club_id;
    const createAdvertisingService = new _CreateAdvertisingService.CreateAdvertisingService();
    const advertising = await createAdvertisingService.execute({
      club_id,
      file
    });
    return res.json(advertising);
  }
}
exports.CreateAdvertisingController = CreateAdvertisingController;