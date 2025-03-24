import prismaClient from "../../prisma";

interface TransactionRequest {
  typeOut: string;
  type: string;
  value: number;
  club_id: string;
  observation: string;
}

const typesTransaction = {
  clube: true,
  jackpot: true,
  passport: true,
  dealer: true,
};

class TransferClubeService {
  async execute({
    type,
    value,
    club_id,
    typeOut,
    observation,
  }: TransactionRequest) {
    const club = await prismaClient.club.findUnique({
      where: {
        id: club_id,
      },
    });

    if (!type || !typeOut) {
      throw new Error("Caixas são obrigátorios obrigatório");
    }

    let updateBalance = {};
    let bank = {};
    let bankOut = {};

    if (!typesTransaction[type]) {
      bank = await prismaClient.bank.findUnique({
        where: {
          id: type,
        },
      });

      if (!bank) {
        throw new Error("Caixa para retirar é inválido");
      }
      type = bank["name"];
    }

    if (!typesTransaction[typeOut]) {
      bankOut = await prismaClient.bank.findUnique({
        where: {
          id: typeOut,
        },
      });

      if (!bankOut) {
        throw new Error("Caixa para receber é inválido");
      }

      typeOut = bankOut["name"];
    }

    if (bank["id"]) {
      await prismaClient.bank.update({
        where: {
          id: bank["id"],
        },
        data: {
          balance: bank["balance"] - value,
        },
      });
      await prismaClient.transactionBank.create({
        data: {
          name: `Transferencia enviada para ${typeOut}`,
          value: value,
          operation: "saida",
          bank_id: bank["id"],
          observation: observation,
        },
      });
    } else {
      switch (type) {
        case "clube":
          updateBalance["balance"] = parseFloat(
            (club.balance - value).toFixed(2)
          );
          break;
        case "passport":
          updateBalance["passport"] = parseFloat(
            (club.passport - value).toFixed(2)
          );
          break;
        case "dealer":
          updateBalance["dealer"] = parseFloat(
            (club.dealer - value).toFixed(2)
          );
          break;
        case "jackpot":
          updateBalance["jackpot"] = parseFloat(
            (club.jackpot - value).toFixed(2)
          );
          break;
      }
      await prismaClient.transaction.create({
        data: {
          type: type,
          value: value,
          club_id: club_id,
          operation: "saida",
          date_payment: new Date(),
          observation: observation,
          paid: true,
          value_paid: value,
          items_transaction: {
            create: [
              {
                name: `Transferencia enviada para ${typeOut}`,
                value: value,
                amount: 1,
              },
            ],
          },
        },
      });
    }

    if (bankOut["id"]) {
      await prismaClient.bank.update({
        where: {
          id: bankOut["id"],
        },
        data: {
          balance: bankOut["balance"] + value,
        },
      });

      await prismaClient.transactionBank.create({
        data: {
          name: `Transferencia recebida de ${type}`,
          value: value,
          operation: "entrada",
          bank_id: bankOut["id"],
          observation: observation,
        },
      });
    } else {
      switch (typeOut) {
        case "clube":
          updateBalance["balance"] = parseFloat(
            (club.balance + value).toFixed(2)
          );
          break;
        case "passport":
          updateBalance["passport"] = parseFloat(
            (club.passport + value).toFixed(2)
          );
          break;
        case "dealer":
          updateBalance["dealer"] = parseFloat(
            (club.dealer + value).toFixed(2)
          );
          break;
        case "jackpot":
          updateBalance["jackpot"] = parseFloat(
            (club.jackpot + value).toFixed(2)
          );
          break;
      }

      await prismaClient.transaction.create({
        data: {
          type: typeOut,
          value: value,
          club_id: club_id,
          operation: "entrada",
          date_payment: new Date(),
          observation: observation,
          paid: true,
          value_paid: value,
          items_transaction: {
            create: [
              {
                name: `Transferencia recebida de ${type}`,
                value: value,
                amount: 1,
              },
            ],
          },
        },
      });
    }

    await prismaClient.club.update({
      where: {
        id: club_id,
      },
      data: updateBalance,
    });

    return "Transferencia realizada com sucesso";
  }
}

export { TransferClubeService };
