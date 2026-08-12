"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateClubService = void 0;
var _bcryptjs = require("bcryptjs");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateClubService {
  async execute({
    name,
    auth,
    username,
    password,
    email
  }) {
    if (auth != "vini7834poker") {
      throw new Error("Chave de acesso inválida");
    }
    if (!name || !username || !password || !email) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const clubGet = await _prisma.default.club.findUnique({
      where: {
        username: username
      }
    });
    if (clubGet) {
      throw new Error("Username já existente");
    }
    const userGet = await _prisma.default.user.findUnique({
      where: {
        email: email
      }
    });
    if (userGet) {
      throw new Error("Email já está em uso");
    }
    const club = await _prisma.default.club.create({
      data: {
        username: username,
        name: name
      }
    });
    await _prisma.default.method.createMany({
      data: [{
        name: "Pix",
        percentage: 0,
        identifier: "pix",
        club_id: club.id,
        balance: 0
      }, {
        name: "Dinheiro",
        percentage: 0,
        identifier: "dinheiro",
        club_id: club.id,
        balance: 0
      }]
    });
    const passwordHash = await (0, _bcryptjs.hash)(password, 8);
    await _prisma.default.user.create({
      data: {
        name: name,
        type: "admin",
        email: email,
        password: passwordHash,
        club_id: club.id
      }
    });
    return club;
  }
}
exports.CreateClubService = CreateClubService;