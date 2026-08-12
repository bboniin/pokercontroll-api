"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateClubController = void 0;
var _CreateClubService = require("../../services/Club/CreateClubService");
class CreateClubController {
  async handle(req, res) {
    const {
      name,
      username,
      email,
      password,
      auth
    } = req.body;
    const createClubService = new _CreateClubService.CreateClubService();
    const club = await createClubService.execute({
      name,
      username,
      email,
      password,
      auth
    });
    return res.json(club);
  }
}
exports.CreateClubController = CreateClubController;