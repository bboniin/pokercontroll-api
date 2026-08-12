"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClientsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListClientsService {
  async execute({
    club_id,
    page,
    all,
    search
  }) {
    let filter = {};
    if (!all) {
      filter = {
        skip: page * 30,
        take: 30
      };
    }
    let where = {
      club_id: club_id,
      visible: true
    };
    if (search) {
      where["OR"] = [{
        name: {
          contains: search,
          mode: "insensitive"
        }
      }, {
        cpf: {
          contains: search,
          mode: "insensitive"
        }
      }, {
        phone_number: {
          contains: search,
          mode: "insensitive"
        }
      }];
    }
    const clientsTotal = await _prisma.default.client.count({
      where: where
    });
    const clients = await _prisma.default.client.findMany({
      ...filter,
      where: where,
      orderBy: {
        name: "asc"
      }
    });
    return {
      clients,
      clientsTotal
    };
  }
}
exports.ListClientsService = ListClientsService;