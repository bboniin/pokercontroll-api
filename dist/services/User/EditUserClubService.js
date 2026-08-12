"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditUserClubService = void 0;
var _bcryptjs = require("bcryptjs");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditUserClubService {
  async execute({
    name,
    email,
    club_id,
    type,
    password,
    user_id
  }) {
    const user = await _prisma.default.user.findFirst({
      where: {
        id: user_id,
        club_id: club_id
      }
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const emailVerify = await _prisma.default.user.findUnique({
      where: {
        id: email
      }
    });
    if (!email || !name || !type) {
      throw new Error("Preencha todos os campos obrigatórios");
    }
    if (emailVerify) {
      if (emailVerify.id != user.id) {
        throw new Error("Email já está sendo usado");
      }
    }
    let data = {
      name: name,
      email: email,
      type: type
    };
    if (password) {
      data["password"] = await (0, _bcryptjs.hash)(password, 8);
    }
    const userRes = await _prisma.default.user.update({
      where: {
        id: user_id
      },
      data: data
    });
    return userRes;
  }
}
exports.EditUserClubService = EditUserClubService;