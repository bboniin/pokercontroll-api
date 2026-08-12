"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuyTournamentController = void 0;
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _GetTournamentService = require("../../services/Tournament/GetTournamentService");
var _BuyTournamentService = require("../../services/Tournament/BuyTournamentService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
var _VerifyBuyTournamentService = require("../../services/Tournament/VerifyBuyTournamentService");
var _CreatePassportService = require("../../services/Transaction/CreatePassportService");
var _CreateJackpotService = require("../../services/Transaction/CreateJackpotService");
var _CreateDealerService = require("../../services/Transaction/CreateDealerService");
var _functions = require("../../utils/functions");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class BuyTournamentController {
  async handle(req, res) {
    const {
      purchases,
      methods_transaction,
      client_id,
      buyer_id,
      // Campo opcional de comprador (quem está pagando)
      date_payment,
      observation,
      tournament_id
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;

    // O pagador será o comprador se fornecido, senão o próprio beneficiário
    const payer_id = buyer_id || client_id;
    const getTournamentService = new _GetTournamentService.GetTournamentService();
    const tournament = await getTournamentService.execute({
      id: tournament_id,
      club_id,
      blind: false
    });

    // Obter nomes dos clientes para enriquecer logs e descrições
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
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    if (valueCredit) {
      const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
      await verifyCreditTransactionService.execute({
        client_id: payer_id,
        club_id,
        value: valueCredit,
        club: false
      });
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
      });
    }
    let methods_transactionC = methods_transaction.filter(item => item["id"] != "Crédito");
    const verifyBuyTournamentService = new _VerifyBuyTournamentService.VerifyBuyTournamentService();
    const tournamentPur = await verifyBuyTournamentService.execute({
      client_id,
      purchases,
      tournament_id: tournament_id
    });
    const clientTournament = tournamentPur.clients[0];
    await _prisma.default.$transaction(async tx => {
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
      let totalToken = 0;
      let totalValue = 0;
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
              client_id: clientTournament.id,
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
                user_id,
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0
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
                user_id,
                operation: "entrada",
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0
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
                user_id,
                operation: "entrada",
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0
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
                user_id,
                valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
                valueDebit: 0
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
            client_id: clientTournament.id,
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
          user_id,
          valueReceive: methodsPay.find(item => item["id"] == "Saldo")?.value || 0,
          valueDebit: 0
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
    return res.json("Compra realizada com sucesso");
  }
}
exports.BuyTournamentController = BuyTournamentController;