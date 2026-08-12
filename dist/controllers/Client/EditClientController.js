"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditClientController = void 0;
var _EditClientService = require("../../services/Client/EditClientService");
class EditClientController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    const {
      name,
      credit,
      cpf,
      address,
      phone_number,
      birthday,
      observation
    } = req.body;
    let photo = "";
    if (req.file) {
      photo = req.file.filename;
    }
    let club_id = req.club_id;
    const editClientService = new _EditClientService.EditClientService();
    const client = await editClientService.execute({
      name,
      credit: credit ? parseFloat(credit) : 0,
      cpf,
      address,
      birthday,
      phone_number,
      observation,
      photo,
      club_id,
      client_id
    });
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json(client);
  }
}
exports.EditClientController = EditClientController;