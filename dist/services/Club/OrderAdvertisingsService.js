"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderAdvertisingsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class OrderAdvertisingsService {
  async execute({
    advertisings,
    club_id
  }) {
    if (!club_id || !advertisings) {
      throw new Error("Arquivo e clube são obrigatórios");
    }
    const club = await _prisma.default.club.findUnique({
      where: {
        id: club_id
      }
    });
    if (!club) {
      throw new Error("Clube não encontrado");
    }
    const updateOperations = advertisings.map((advertising, index) => {
      return _prisma.default.advertising.update({
        where: {
          id: advertising.id
        },
        data: {
          order: index,
          repetitions: advertising.repetitions
        }
      });
    });
    const orderAdvertisings = await _prisma.default.$transaction(updateOperations);
    return orderAdvertisings;
  }
}
exports.OrderAdvertisingsService = OrderAdvertisingsService;