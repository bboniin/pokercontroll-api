import prismaClient from "../../prisma";

interface MethodRequest {
  id: string;
  method_id?: string;
  name: string;
  value: number;
  percentage: number;
}

interface BuyCashRequest {
  value: number;
  sector_id: string;
  methods_transaction: MethodRequest[];
  client_id: string;
  date_payment?: string;
  observation?: string;
  club_id: string;
  user_id: string;
}

class BuyCashService {
  async execute({
    value,
    sector_id,
    methods_transaction,
    client_id,
    date_payment,
    observation,
    club_id,
    user_id,
  }: BuyCashRequest) {
    if (!client_id || !club_id || !value) {
      throw new Error("Cliente, clube e valor são obrigatórios");
    }

    // Executamos tudo dentro de uma transação Prisma interativa
    return await prismaClient.$transaction(async (tx) => {
      // 1. Validar Cliente e Clube
      const client = await tx.client.findFirst({
        where: { id: client_id, club_id },
      });
      if (!client) {
        throw new Error("Cliente não encontrado");
      }

      const club = await tx.club.findUnique({
        where: { id: club_id },
      });
      if (!club) {
        throw new Error("Clube não encontrado");
      }

      // 2. Tratar Pagamento com Crédito (se houver)
      const creditMethod = methods_transaction.find((item) => item.id === "Crédito");
      const valueCredit = creditMethod ? creditMethod.value : 0;

      if (valueCredit > 0) {
        if (client.debt + valueCredit > client.credit) {
          throw new Error("Crédito insuficiente para essa transação");
        }
        await tx.client.update({
          where: { id: client_id },
          data: {
            debt: parseFloat((client.debt + valueCredit).toFixed(2)),
          },
        });
      }

      // 3. Tratar Pagamento com Saldo (se houver)
      const saldoMethod = methods_transaction.find((item) => item.id === "Saldo");
      const valueReceive = saldoMethod ? saldoMethod.value : 0;

      if (valueReceive > 0) {
        if (parseFloat(client.receive.toFixed(2)) < valueReceive) {
          throw new Error("Valor de pagamento com saldo é maior do que o cliente tem a receber");
        }

        // Quitar transações de saída em aberto (como no PaymentReceivesService)
        const openTransactions = await tx.transaction.findMany({
          where: {
            client_id: client_id,
            club_id: club_id,
            paid: false,
            operation: "saida",
          },
          orderBy: {
            create_at: "asc",
          },
        });

        let remainingValueReceive = valueReceive;
        for (const item of openTransactions) {
          if (remainingValueReceive <= 0) break;

          let valuePaidDiff = item.value - item.value_paid;
          let paymentValue = Math.min(valuePaidDiff, remainingValueReceive);

          if (paymentValue > 0) {
            const isFullyPaid = valuePaidDiff <= remainingValueReceive;
            await tx.transaction.update({
              where: { id: item.id },
              data: {
                paid: isFullyPaid ? true : item.paid,
                value_paid: item.value_paid + paymentValue,
              },
            });

            await tx.methodsTransaction.create({
              data: {
                name: "Saldo",
                percentage: 0,
                value: paymentValue,
                transaction_id: item.id,
                user_id,
              },
            });

            remainingValueReceive -= paymentValue;
          }
        }

        // Atualizar receive do cliente
        await tx.client.update({
          where: { id: client_id },
          data: {
            receive: parseFloat((client.receive - valueReceive).toFixed(2)),
          },
        });
      }

      // 4. Tratar outros métodos de pagamento e registrar a transação do clube
      let methodsPay = methods_transaction.filter(
        (item) =>
          item.id !== "Crédito" &&
          item.id !== "Pag Dívida" &&
          item.id !== "Saldo"
      );

      let valuePaid = methodsPay.length
        ? methodsPay
            .map((method) => method.value)
            .reduce((total, val) => total + val, 0)
        : 0;

      let valueMethods = methodsPay.length
        ? methodsPay
            .map(
              (method) => method.value * ((100 - (method.percentage || 0)) / 100)
            )
            .reduce((total, val) => total + val, 0)
        : 0;

      const datePaymentObj = date_payment ? new Date(date_payment) : new Date();

      // Criar a transação
      const transaction = await tx.transaction.create({
        data: {
          type: "clube",
          value: value,
          client_id: client_id,
          club_id: club_id,
          sector_id: sector_id,
          operation: "entrada",
          date_payment: datePaymentObj,
          observation: observation || null,
          paid: valueReceive === value ? true : valueCredit > 0 ? false : true,
          user_id: user_id,
          value_paid: valuePaid + valueReceive,
        },
      });

      // Atualizar o saldo do clube
      if (value) {
        await tx.club.update({
          where: { id: club_id },
          data: {
            balance: parseFloat((club.balance + valueMethods).toFixed(2)),
          },
        });
      }

      // Criar item da transação
      await tx.itemsTransaction.create({
        data: {
          name: "cash",
          value: value,
          type: "",
          product_id: "",
          amount: 1,
          transaction_id: transaction.id,
        },
      });

      // Atualizar os saldos de cada método e criar os methodsTransaction
      for (const item of methods_transaction) {
        if (item.id !== "Crédito" && item.value) {
          if (item.id !== "Pag Dívida" && item.id !== "Saldo") {
            const method = await tx.method.findUnique({
              where: { id: item.id },
            });
            if (method) {
              let methodBalance = method.balance + item.value * ((100 - (item.percentage || 0)) / 100);
              await tx.method.update({
                where: { id: item.id },
                data: { balance: methodBalance },
              });
            }
          }
          await tx.methodsTransaction.create({
            data: {
              name: item.name,
              percentage: item.percentage || 0,
              value: item.value,
              transaction_id: transaction.id,
              method_id: item.method_id || ((item.id !== "Saldo" && item.id !== "Pag Dívida") ? item.id : ""),
              user_id,
            },
          });
        }
      }

      return transaction;
    });
  }
}

export { BuyCashService };
