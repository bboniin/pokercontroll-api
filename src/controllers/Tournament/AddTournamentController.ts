import { Request, Response } from "express";
import { AddTournamentService } from "../../services/Tournament/AddTournamentService";
import { VerifyCreditTransactionService } from "../../services/Transaction/VerifyCreditTransactionService";
import { GetTournamentService } from "../../services/Tournament/GetTournamentService";
import { CreateDealerService } from "../../services/Transaction/CreateDealerService";
import { CreatePassportService } from "../../services/Transaction/CreatePassportService";
import { CreateJackpotService } from "../../services/Transaction/CreateJackpotService";
import { CreateTransactionService } from "../../services/Transaction/CreateTransactionService";
import { BuyTournamentService } from "../../services/Tournament/BuyTournamentService";
import { GetClientService } from "../../services/Client/GetClientService";
import { getMethodsPay } from "../../utils/functions";
import { PaymentReceivesService } from "../../services/Transaction/PaymentReceivesService";
import prismaClient from "../../prisma";

class AddTournamentController {
  async handle(req: Request, res: Response) {
    const {
      client_id,
      chair,
      tournament_id,
      timechip,
      value,
      purchases,
      date_payment,
      observation,
      methods_transaction,
    } = req.body;

    let club_id = req.club_id;

    const getTournamentService = new GetTournamentService();

    const tournament = await getTournamentService.execute({
      id: tournament_id,
      club_id,
    });

    purchases.map((item) => {
      const purchaseInfo = tournament.purchases.find(
        (data) => data.id == item.id
      );
      if (purchaseInfo) {
        item.name = purchaseInfo.name;
        item.type = purchaseInfo.type;
        item.cashier = purchaseInfo.cashier;
        item.token = purchaseInfo.token;
        item.value = purchaseInfo.value;
      } else {
        throw new Error("Compra não encontrada");
      }
    });

    let totalValue = 0;

    let valueCredit =
      methods_transaction.filter((item) => item["id"] == "Crédito").length != 0
        ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value
        : 0;

    if (valueCredit) {
      const verifyCreditTransactionService =
        new VerifyCreditTransactionService();

      await verifyCreditTransactionService.execute({
        client_id,
        club_id,
        value: valueCredit,
        club: false,
      });
    }

    let valueReceive =
      methods_transaction.filter((item) => item["id"] == "Saldo").length != 0
        ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value
        : 0;

    const paymentDebtsService = new PaymentReceivesService();

    if (valueReceive) {
      await paymentDebtsService.execute({
        value: valueReceive,
        client_id,
        club_id,
      });
    }

    let methods_transactionC = methods_transaction.filter(
      (item) => item["id"] != "Crédito"
    );

    let token = timechip ? tournament.timechip : 0;

    const addTournamentService = new AddTournamentService();

    const clientTournament = await addTournamentService.execute({
      chair,
      client_id,
      tournament_id,
      tokenTimechip: token,
    });

    let totalToken = token;

    await Promise.all(
      purchases.map(async (item) => {
        switch (item.cashier) {
          case "dealer": {
            let { payCredit, methodsPay, methodsC } = await getMethodsPay(
              item.value * item.amount,
              methods_transactionC
            );
            const createDealerService = new CreateDealerService();
            await createDealerService.execute({
              paid: payCredit ? false : true,
              value: item.value * item.amount,
              type: item.cashier,
              methods_transaction: methodsPay,
              client_id,
              sector_id: tournament_id,
              club_id,
              date_payment,
              observation,
              items_transaction: {
                name: item.name,
                amount: item.amount,
                value: item.value * item.amount,
              },
              operation: "entrada",
              valueReceive,
              valueDebit: 0,
            });
            methods_transactionC = methodsC;
            break;
          }
          case "passport": {
            let { payCredit, methodsPay, methodsC } = await getMethodsPay(
              item.value * item.amount,
              methods_transactionC
            );
            const createPassportService = new CreatePassportService();
            await createPassportService.execute({
              paid: payCredit ? false : true,
              value: item.value * item.amount,
              type: item.cashier,
              methods_transaction: methodsPay,
              client_id,
              sector_id: tournament_id,
              club_id,
              date_payment,
              observation,
              items_transaction: {
                name: item.name,
                amount: item.amount,
                value: item.value * item.amount,
              },
              operation: "entrada",
              valueReceive,
              valueDebit: 0,
            });
            methods_transactionC = methodsC;
            break;
          }
          case "jackpot": {
            let { payCredit, methodsPay, methodsC } = await getMethodsPay(
              item.value * item.amount,
              methods_transactionC
            );
            const createJackpotService = new CreateJackpotService();
            await createJackpotService.execute({
              paid: payCredit ? false : true,
              value: item.value * item.amount,
              type: item.cashier,
              methods_transaction: methodsPay,
              client_id,
              sector_id: tournament_id,
              club_id,
              date_payment,
              observation,
              items_transaction: {
                name: item.name,
                amount: item.amount,
                value: item.value * item.amount,
              },
              operation: "entrada",
              valueReceive,
              valueDebit: 0,
            });
            methods_transactionC = methodsC;
            break;
          }
          default: {
            let { payCredit, methodsPay, methodsC } = await getMethodsPay(
              item.value * item.amount,
              methods_transactionC
            );
            const createTransactionService = new CreateTransactionService();
            await createTransactionService.execute({
              paid: payCredit ? false : true,
              value: item.value * item.amount,
              type: "clube",
              methods_transaction: methodsPay,
              client_id,
              sector_id: tournament_id,
              club_id,
              date_payment,
              observation,
              items_transaction: [
                {
                  name: item.name,
                  amount: item.amount,
                  value: item.value * item.amount,
                },
              ],
              operation: "entrada",
              valueReceive,
              valueDebit: 0,
            });
            methods_transactionC = methodsC;
            totalValue += item.value * item.amount;
            totalToken += item.token * item.amount;
            break;
          }
        }
        await prismaClient.clientPurchase.create({
          data: {
            name: item.name,
            type: item.type,
            tournament_id: tournament.id,
            client_id: clientTournament.id,
            purchase_id: item.id,
            value: item.value,
            total_value: item.value * item.amount,
            amount: item.amount,
          },
        });
      })
    );

    const buyTournamentService = new BuyTournamentService();

    await buyTournamentService.execute({
      tournament_id: tournament_id,
      totalValue,
      totalToken,
    });

    const getClientService = new GetClientService();

    const { client } = await getClientService.execute({
      club_id,
      client_id,
      page: 0,
    });

    if (client["photo"]) {
      client["photo_url"] =
        "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
        client["photo"];
    }

    return res.json(client);
  }
}

export { AddTournamentController };
