"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateUserClubController = void 0;
var _CreateUserClubService = require("../../services/User/CreateUserClubService");
class CreateUserClubController {
  async handle(req, res) {
    const {
      name,
      email,
      type,
      password
    } = req.body;
    let club_id = req.club_id;
    const createUserClubService = new _CreateUserClubService.CreateUserClubService();
    const user = await createUserClubService.execute({
      name: name,
      email: email,
      password: password,
      type: type,
      club_id: club_id
    });
    return res.json(user);
  }
}
exports.CreateUserClubController = CreateUserClubController;