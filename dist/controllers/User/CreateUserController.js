"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateUserController = void 0;
var _CreateUserService = require("../../services/User/CreateUserService");
class CreateUserController {
  async handle(req, res) {
    const {
      name,
      email,
      phone_number,
      password
    } = req.body;
    const createUserService = new _CreateUserService.CreateUserService();
    const user = await createUserService.execute({
      name: "Teste",
      email: "boninho7834@gmail.com",
      password: "123",
      type: "admin",
      club_id: "58dfg4dsf-dsf2sf57-asdfgsd5"
    });
    return res.json(user);
  }
}
exports.CreateUserController = CreateUserController;