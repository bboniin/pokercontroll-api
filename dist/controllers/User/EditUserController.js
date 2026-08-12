"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditUserController = void 0;
var _EditUserService = require("../../services/User/EditUserService");
class EditUserController {
  async handle(req, res) {
    const {
      name,
      email,
      phone_number,
      password
    } = req.body;
    let photo = "";
    if (req.file) {
      photo = req.file.filename;
    }
    let user_id = req.user_id;
    const editUserService = new _EditUserService.EditUserService();
    const user = await editUserService.execute({
      name,
      email,
      phone_number,
      photo,
      password,
      user_id
    });
    if (user["photo"]) {
      user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }
    return res.json(user);
  }
}
exports.EditUserController = EditUserController;