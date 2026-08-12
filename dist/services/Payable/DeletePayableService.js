"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeletePayableService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeletePayableService {
  async execute({
    payable_id
  }) {
    const payable = await _prisma.default.payable.delete({
      where: {
        id: payable_id
      }
    });
    return payable;
  }
}
exports.DeletePayableService = DeletePayableService;