"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateMethodController = void 0;
var _CreateMethodService = require("../../services/Method/CreateMethodService");
class CreateMethodController {
  async handle(req, res) {
    const {
      name,
      percentage,
      identifier
    } = req.body;
    let club_id = req.club_id;
    const createMethodService = new _CreateMethodService.CreateMethodService();
    const method = await createMethodService.execute({
      name,
      percentage: percentage ? parseFloat(percentage) : 0,
      identifier,
      club_id
    });
    return res.json(method);
  }
}
exports.CreateMethodController = CreateMethodController;