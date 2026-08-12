"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteClientService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteClientService {
  async execute({
    client_id,
    club_id,
    user_id
  }) {
    const user = await _prisma.default.user.findFirst({
      where: {
        id: user_id,
        club_id: club_id,
        type: "admin"
      }
    });
    if (!user) {
      throw new Error("Rota restrita para administrador");
    }
    const client = await _prisma.default.client.update({
      where: {
        id: client_id
      },
      data: {
        visible: false
      }
    });
    return client;
  }
}
exports.DeleteClientService = DeleteClientService;