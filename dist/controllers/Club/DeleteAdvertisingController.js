"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteAdvertisingController = void 0;
var _DeleteAdvertisingService = require("../../services/Club/DeleteAdvertisingService");
class DeleteAdvertisingController {
  async handle(req, res) {
    const {
      advertising_id
    } = req.params;
    const club_id = req.club_id;
    const deleteAdvertisingService = new _DeleteAdvertisingService.DeleteAdvertisingService();
    const advertising = await deleteAdvertisingService.execute({
      club_id,
      advertising_id
    });
    return res.json(advertising);
  }
}
exports.DeleteAdvertisingController = DeleteAdvertisingController;