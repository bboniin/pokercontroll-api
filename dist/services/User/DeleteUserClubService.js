"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteUserClubService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteUserClubService {
  async execute({
    user_id
  }) {
    const user = await _prisma.default.user.delete({
      where: {
        id: user_id
      }
    });
    return user;
  }
}
exports.DeleteUserClubService = DeleteUserClubService;