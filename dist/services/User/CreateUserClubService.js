"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateUserClubService = void 0;
var _bcryptjs = require("bcryptjs");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateUserClubService {
  async execute({
    name,
    email,
    password,
    type,
    club_id
  }) {
    if (!email || !name || !type || !password) {
      throw new Error("Preencha todos os campos obrigatórios");
    }
    const userAlreadyExists = await _prisma.default.user.findFirst({
      where: {
        email: email
      }
    });
    if (userAlreadyExists) {
      throw new Error("Email já cadastrado");
    }
    const passwordHash = await (0, _bcryptjs.hash)(password, 8);
    const user = await _prisma.default.user.create({
      data: {
        name: name,
        email: email,
        type: type,
        club_id: club_id,
        password: passwordHash
      },
      select: {
        name: true,
        email: true,
        type: true
      }
    });
    return user;
  }
}
exports.CreateUserClubService = CreateUserClubService;