"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteMethodService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteMethodService {
  async execute({
    method_id,
    club_id
  }) {
    const method = await _prisma.default.method.delete({
      where: {
        id: method_id
      }
    });
    return method;
  }
}
exports.DeleteMethodService = DeleteMethodService;