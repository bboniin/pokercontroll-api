"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetUserController = void 0;
var _GetUserService = require("../../services/User/GetUserService");
class GetUserController {
  async handle(req, res) {
    let user_id = req.user_id;
    const getUserService = new _GetUserService.GetUserService();
    const user = await getUserService.execute({
      user_id
    });
    if (user["photo"]) {
      user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }
    return res.json(user);
  }
}
exports.GetUserController = GetUserController;