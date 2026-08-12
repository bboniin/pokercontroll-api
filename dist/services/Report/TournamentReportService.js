"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TournamentReportService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class TournamentReportService {
  async execute({
    club_id,
    sector_id,
    method,
    type
  }) {
    let data = {
      club_id: club_id,
      sector_id: sector_id
    };
    if (method) {
      if (method == "nao-pago") {
        data["paid"] = false;
      } else {
        data["methods_transaction"] = {
          some: {
            name: method
          }
        };
      }
    }
    if (type) {
      data["operation"] = type;
    }
    let totalIn = 0;
    let methodsIn = {
      nao_pago: {
        name: "Não Pago",
        value: 0
      }
    };
    let totalOut = 0;
    let methodsOut = {
      nao_pago: {
        name: "Não Pago",
        value: 0
      }
    };
    const transactions = await _prisma.default.transaction.findMany({
      where: data,
      orderBy: {
        create_at: "desc"
      },
      include: {
        client: true,
        methods_transaction: {
          orderBy: {
            create_at: "desc"
          },
          where: method && method != "nao-pago" ? {
            name: method
          } : {}
        },
        items_transaction: {
          orderBy: {
            create_at: "desc"
          }
        }
      }
    });
    transactions.map(item => {
      if (item.operation == "entrada") {
        totalIn += item.value;
        item.methods_transaction.map(data => {
          if (methodsIn[data.name]) {
            methodsIn[data.name].value += data.value;
          } else {
            methodsIn[data.name] = {
              name: data.name,
              value: data.value
            };
          }
        });
        methodsIn["nao_pago"].value += item.value - item.value_paid;
      } else {
        totalOut += item.value;
        item.methods_transaction.map(data => {
          if (methodsOut[data.name]) {
            methodsOut[data.name].value += data.value;
          } else {
            methodsOut[data.name] = {
              name: data.name,
              value: data.value
            };
          }
        });
        methodsOut["nao_pago"].value += item.value - item.value_paid;
      }
    });
    return {
      transactions: transactions,
      totalIn,
      totalOut,
      methodsIn: Object.values(methodsIn),
      methodsOut: Object.values(methodsOut)
    };
  }
}
exports.TournamentReportService = TournamentReportService;