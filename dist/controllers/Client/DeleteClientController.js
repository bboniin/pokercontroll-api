"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteClientController = void 0;
var _DeleteClientService = require("../../services/Client/DeleteClientService");
class DeleteClientController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const deleteClientService = new _DeleteClientService.DeleteClientService();
    const user = await deleteClientService.execute({
      club_id,
      client_id,
      user_id
    });
    return res.json(user);
  }
}
exports.DeleteClientController = DeleteClientController;