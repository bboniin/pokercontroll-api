import prismaClient from "../../prisma";

interface BoxRequest {
  user_id: string;
  box_id: string;
  club_id: string;
}

class GetFinancialBoxClubService {
  async execute({ user_id, club_id, box_id }: BoxRequest) {
    const admin = await prismaClient.user.findFirst({
      where: {
        id: user_id,
        type: "admin",
      },
    });

    if (!admin) {
      throw new Error("Rota restrita para administrador");
    }

    const box_ids = box_id.split(",");

    let financialBoxes = await prismaClient.financialBox.findMany({
      where: {
        id: {
          in: box_ids,
        },
        club_id: club_id,
      },
      include: {
        user: true,
      },
    });

    if (financialBoxes.length === 0) {
      throw new Error("Caixa(s) não encontrado(s)");
    }

    const dateConditions = financialBoxes.map((box) => ({
      OR: [
        {
          create_at: {
            gte: box.date_initial,
            ...(box.closed ? { lte: box.date_end } : {}),
          },
        },
        {
          methods_transaction: {
            some: {
              user_id: user_id,
              create_at: {
                gte: box.date_initial,
                ...(box.closed ? { lte: box.date_end } : {}),
              },
            },
          },
        },
      ],
    }));

    const transactions = await prismaClient.transaction.findMany({
      where: {
        club_id: club_id,
        OR: dateConditions,
      },
      include: {
        methods_transaction: true,
        items_transaction: true,
        client: true,
        historics_transaction: {
          orderBy: {
            create_at: "desc",
          },
        },
      },
    });

    const financialBox =
      financialBoxes.length == 1
        ? financialBoxes[0]
        : {
            closed: true,
            resumed: true,
            value_initial: financialBoxes.reduce((acumulador, caixaAtual) => {
              return acumulador + caixaAtual.value_initial;
            }, 0),
          };

    const methods = await prismaClient.method.findMany({
      where: {
        club_id: club_id,
      },
    });

    let newMethods = [
      {
        name: "Pagamento Pendente",
        value_entrie: 0,
        value_out: 0,
      },
      {
        name: "Pag Dívida",
        value_entrie: 0,
        value_out: 0,
      },
      {
        name: "Saldo",
        value_entrie: 0,
        value_out: 0,
      },
    ];

    const methodsPay = [...methods, ...newMethods];

    methodsPay.map((item) => {
      item["value_entrie"] = 0;
      item["value_out"] = 0;
    });

    financialBox["totalEntrie"] = 0;
    financialBox["totalOut"] = 0;
    financialBox["totalEntrieFuture"] = 0;
    financialBox["totalOutFuture"] = 0;

    const totals = {};
    const clients = {};

    transactions.forEach((transaction) => {
      const isEntrada = transaction.operation === "entrada";

      if (!clients[transaction.client_id] && transaction.client_id) {
        clients[transaction.client_id] = transaction.client;
      }

      if (transaction.user_id == user_id && !transaction.paid) {
        if (!totals["Pagamento Pendente"]) {
          totals["Pagamento Pendente"] = { value_entrie: 0, value_out: 0 };
        }
        if (isEntrada) {
          totals["Pagamento Pendente"].value_entrie +=
            transaction.value - transaction.value_paid;
          financialBox["totalEntrieFuture"] +=
            transaction.value - transaction.value_paid;
        } else {
          totals["Pagamento Pendente"].value_out +=
            transaction.value - transaction.value_paid;
          financialBox["totalOutFuture"] +=
            transaction.value - transaction.value_paid;
        }
      }
      if (
        transaction.methods_transaction &&
        transaction.methods_transaction.length > 0
      ) {
        transaction.methods_transaction.forEach((method) => {
          const methodName = method.name;

          if (!totals[methodName]) {
            totals[methodName] = { value_entrie: 0, value_out: 0 };
          }

          if (isEntrada) {
            totals[methodName].value_entrie += method.value;
            financialBox["totalEntrie"] += method.value;
          } else {
            totals[methodName].value_out += method.value;
            financialBox["totalOut"] += method.value;
          }
        });
      }
    });

    methodsPay.forEach((method) => {
      const total = totals[method.name];
      if (total) {
        method["value_entrie"] = total.value_entrie;
        method["value_out"] = total.value_out;
      }
    });

    const methodsWithBalance = methodsPay.map((method) => ({
      ...method,
      balance: method["value_entrie"] - method["value_out"],
    }));

    methodsWithBalance.sort((a, b) => {
      const balanceA = a.balance;
      const balanceB = b.balance;

      if (balanceA > 0 && balanceB <= 0) {
        return -1;
      }
      if (balanceA <= 0 && balanceB > 0) {
        return 1;
      }

      if (balanceA < 0 && balanceB >= 0) {
        return -1;
      }
      if (balanceA >= 0 && balanceB < 0) {
        return 1;
      }

      return balanceB - balanceA;
    });

    financialBox["totalBalance"] =
      financialBox["totalEntrie"] - financialBox["totalOut"];
    financialBox["totalBalanceFuture"] =
      financialBox["totalBalance"] +
      financialBox["totalEntrieFuture"] -
      financialBox["totalOutFuture"];
    financialBox["transactions"] = transactions;
    financialBox["methods_transaction"] = methodsWithBalance;
    financialBox["clients"] = clients ? Object.values(clients) : [];

    return financialBox;
  }
}

export { GetFinancialBoxClubService };
