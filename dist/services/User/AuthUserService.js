"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthUserService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _bcryptjs = require("bcryptjs");
var _jsonwebtoken = require("jsonwebtoken");
var _auth = _interopRequireDefault(require("./../../utils/auth"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AuthUserService {
  async execute({
    email,
    password
  }) {
    const user = await _prisma.default.user.findFirst({
      where: {
        email: email
      },
      include: {
        club: {
          select: {
            access_cash: true,
            access_order: true,
            access_report: true,
            access_stock: true,
            access_tournament: true,
            access_users: true
          }
        }
      }
    });
    if (!user) {
      throw new Error("Email e Senha não correspondem ou não existe");
    }
    const passwordMatch = await (0, _bcryptjs.compare)(password, user.password);
    const token = (0, _jsonwebtoken.sign)({
      club_id: user.club_id,
      user_type: user.type
    }, _auth.default.jwt.secret, {
      subject: user.id,
      expiresIn: "365d"
    });
    if (!passwordMatch) {
      throw new Error("Email e Senha não correspondem ou não existe");
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        club_id: user.club_id,
        type: user.type,
        club: user.club
      },
      token
    };
  }
}
exports.AuthUserService = AuthUserService;