"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteMethodController = void 0;
var _DeleteMethodService = require("../../services/Method/DeleteMethodService");
class DeleteMethodController {
  async handle(req, res) {
    const {
      method_id
    } = req.params;
    let club_id = req.club_id;
    const deleteMethodService = new _DeleteMethodService.DeleteMethodService();
    const method = await deleteMethodService.execute({
      club_id,
      method_id
    });
    return res.json(method);
  }
}
exports.DeleteMethodController = DeleteMethodController;