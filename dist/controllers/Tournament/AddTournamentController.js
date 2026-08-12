"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddTournamentController = void 0;
var _AddTournamentService = require("../../services/Tournament/AddTournamentService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
var _GetTournamentService = require("../../services/Tournament/GetTournamentService");
var _CreateDealerService = require("../../services/Transaction/CreateDealerService");
var _CreatePassportService = require("../../services/Transaction/CreatePassportService");
var _CreateJackpotService = require("../../services/Transaction/CreateJackpotService");
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _BuyTournamentService = require("../../services/Tournament/BuyTournamentService");
var _GetClientService = require("../../services/Client/GetClientService");
var _functions = require("../../utils/functions");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AddTournamentController {
  async handle(req, res) {
    const {
      client_id,
      chair,
      tournament_id,
      timechip,
      purchases,
      date_payment,
      observation,
      methods_transaction,
      buyer_id
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const payer_id = buyer_id || client_id;
    const beneficiaryClient = await _prisma.default.client.findFirst({
      where: {
        id: client_id
      }
    });
    const beneficiaryName = beneficiaryClient ? beneficiaryClient.name : "";
    let buyerName = "";
    if (buyer_id) {
      const buyerClient = await _prisma.default.client.findFirst({
        where: {
          id: buyer_id
        }
      });
      buyerName = buyerClient ? buyerClient.name : "";
    }
    const purchaseIdentifier = buyer_id ? `Pago por ${buyerName}` : "";
    const enrichedObservation = buyer_id ? observation ? `${observation} (Pago para ${beneficiaryName})` : `Pago para ${beneficiaryName}` : observation;
    const getTournamentService = new _GetTournamentService.GetTournamentService();
    const tournament = await getTournamentService.execute({
      id: tournament_id,
      club_id,
      blind: false
    });
    const addTournamentService = new _AddTournamentService.AddTournamentService();
    await addTournamentService.execute({
      chair,
      client_id,
      tournament_id,
      tokenTimechip: 0,
      verify: true
    });
    purchases.map(item => {
      const purchaseInfo = tournament.purchases.find(data => data.id == item.id);
      if (purchaseInfo) {
        item.name = purchaseInfo.name;
        item.type = purchaseInfo.type;
        item.cashier = purchaseInfo.cashier;
        item.token = purchaseInfo.token;
        item.value = purchaseInfo.value;
        item.multiple = purchaseInfo.multiple;
        item.token_staff = purchaseInfo.token_staff;
        item.value_staff = purchaseInfo.value_staff;
      } else {
        throw new Error("Compra não encontrada");
      }
    });
    let client = null;
    await _prisma.default.$transaction(async tx => {
      let totalValue = 0;
      let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
      if (valueCredit) {
        const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
        await verifyCreditTransactionService.execute({
          client_id: payer_id,
          club_id,
          value: valueCredit,
          club: false
        }, tx);
      }
      let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
      const paymentReceivesService = new _PaymentReceivesService.PaymentReceivesService();
      if (valueReceive) {
        await paymentReceivesService.execute({
          value: valueReceive,
          client_id: payer_id,
          club_id,
          confirm: false,
          user_id
        }, tx);
      }
      let methods_transactionC = methods_transaction.filter(item => item["id"] != "Crédito");
      let token = timechip ? tournament.timechip : 0;
      const clientTournament = await addTournamentService.execute({
        chair,
        client_id,
        tournament_id,
        tokenTimechip: token,
        verify: false
      }, tx);
      let totalToken = token;
      let totalTokenStaff = 0;
      let totalValueStaff = 0;
      let staffId = Math.random().toString(36).substring(2, 10);
      await Promise.all(purchases.map(async item => {
        if (item.buy_staff) {
          totalTokenStaff += item.token_staff * item.amount;
          totalValueStaff += item.value_staff * item.amount;
          await tx.clientPurchase.create({
            data: {
              name: "Staff",
              type: "staff",
              tournament_id: tournament.id,
              client_id: clientTournament["id"],
              purchase_id: item.id,
              value: item.value_staff,
              identifier: staffId,
              total_value: item.value_staff * item.amount,
              amount: item.amount,
              token: item.token_staff,
              buyer_id: buyer_id || null
            }
          });
        }
        if (item.type == "purchase" || item.type == "entrie") {
          totalValue += item.value * item.amount;
          totalToken += item.token * item.amount;
        }
        switch (item.cashier) {
          case "dealer":
            {
              let {
                payCredit,
                methodsPay,
                methodsC
              } = await (0, _functions.getMethodsPay)(item.value * item.amount, methods_transactionC);
              const createDealerService = new _CreateDealerService.CreateDealerService();
              await createDealerService.execute({
                paid: payCredit ? false : true,
                value: item.value * item.amount,
                type: item.cashier,
                methods_transaction: methodsPay,
                client_id: payer_id,
                sector_id: tournament_id,
                club_id,
                date_payment,
                observation: enrichedObservation,
                items_transaction: {
                  name: item.name,
                  type: item.type,
                  amount: item.amount,
                  value: item.value * item.amount,
                  product_id: item.id
                },
                operation: "entrada",
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0,
                user_id
              }, tx);
              methods_transactionC = methodsC;
              break;
            }
          case "passport":
            {
              let {
                payCredit,
                methodsPay,
                methodsC
              } = await (0, _functions.getMethodsPay)(item.value * item.amount, methods_transactionC);
              const createPassportService = new _CreatePassportService.CreatePassportService();
              await createPassportService.execute({
                paid: payCredit ? false : true,
                value: item.value * item.amount,
                type: item.cashier,
                methods_transaction: methodsPay,
                client_id: payer_id,
                sector_id: tournament_id,
                club_id,
                date_payment,
                observation: enrichedObservation,
                items_transaction: {
                  name: item.name,
                  type: item.type,
                  amount: item.amount,
                  value: item.value * item.amount,
                  product_id: item.id
                },
                operation: "entrada",
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0,
                user_id
              }, tx);
              methods_transactionC = methodsC;
              break;
            }
          case "jackpot":
            {
              let {
                payCredit,
                methodsPay,
                methodsC
              } = await (0, _functions.getMethodsPay)(item.value * item.amount, methods_transactionC);
              const createJackpotService = new _CreateJackpotService.CreateJackpotService();
              await createJackpotService.execute({
                paid: payCredit ? false : true,
                value: item.value * item.amount,
                type: item.cashier,
                methods_transaction: methodsPay,
                client_id: payer_id,
                sector_id: tournament_id,
                club_id,
                date_payment,
                observation: enrichedObservation,
                items_transaction: {
                  name: item.name,
                  type: item.type,
                  amount: item.amount,
                  value: item.value * item.amount,
                  product_id: item.id
                },
                operation: "entrada",
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0,
                user_id
              }, tx);
              methods_transactionC = methodsC;
              break;
            }
          default:
            {
              let {
                payCredit,
                methodsPay,
                methodsC
              } = await (0, _functions.getMethodsPay)(item.value * item.amount, methods_transactionC);
              const createTransactionService = new _CreateTransactionService.CreateTransactionService();
              await createTransactionService.execute({
                paid: payCredit ? false : true,
                value: item.value * item.amount,
                type: "clube",
                methods_transaction: methodsPay,
                client_id: payer_id,
                sector_id: tournament_id,
                club_id,
                date_payment,
                observation: enrichedObservation,
                items_transaction: [{
                  name: item.name,
                  type: item.type,
                  amount: item.amount,
                  value: item.value * item.amount,
                  product_id: item.id
                }],
                operation: "entrada",
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0,
                user_id
              }, tx);
              methods_transactionC = methodsC;
              break;
            }
        }
        await tx.clientPurchase.create({
          data: {
            name: item.name,
            type: item.type,
            tournament_id: tournament.id,
            client_id: clientTournament["id"],
            purchase_id: item.id,
            value: item.value,
            total_value: item.value * item.amount,
            amount: item.amount,
            token: item.token,
            buyer_id: buyer_id || null,
            identifier: ""
          }
        });
      }));
      if (totalValueStaff) {
        let {
          payCredit,
          methodsPay,
          methodsC
        } = await (0, _functions.getMethodsPay)(totalValueStaff, methods_transactionC);
        const createDealerService = new _CreateDealerService.CreateDealerService();
        await createDealerService.execute({
          paid: payCredit ? false : true,
          value: totalValueStaff,
          type: "dealer",
          methods_transaction: methodsPay,
          client_id: payer_id,
          sector_id: tournament_id,
          club_id,
          date_payment,
          observation: enrichedObservation,
          items_transaction: {
            name: "Staff",
            amount: 1,
            value: totalValueStaff,
            product_id: staffId
          },
          operation: "entrada",
          valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
          valueDebit: 0,
          user_id
        }, tx);
        methods_transactionC = methodsC;
      }
      const buyTournamentService = new _BuyTournamentService.BuyTournamentService();
      await buyTournamentService.execute({
        tournament_id: tournament_id,
        totalValue,
        totalToken: totalToken + totalTokenStaff
      }, tx);
    });
    const getClientService = new _GetClientService.GetClientService();
    const result = await getClientService.execute({
      club_id,
      client_id,
      page: 0
    });
    client = result.client;
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json(client);
  }
}
exports.AddTournamentController = AddTournamentController;