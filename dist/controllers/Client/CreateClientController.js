"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateClientController = void 0;
var _CreateClientService = require("../../services/Client/CreateClientService");
class CreateClientController {
  async handle(req, res) {
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
    const createClientService = new _CreateClientService.CreateClientService();
    const client = await createClientService.execute({
      name,
      credit: credit ? parseFloat(credit) : 0,
      cpf,
      address,
      phone_number,
      birthday,
      photo,
      club_id,
      observation
    });
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json(client);
  }
}
exports.CreateClientController = CreateClientController;