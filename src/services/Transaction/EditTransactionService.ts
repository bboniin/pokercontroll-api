import prismaClient from "../../prisma";

interface MethodRequest {
  id: string; // method_id ou transaction_method_id
  method_id?: string;
  name: string;
  value: number;
  percentage: number;
}

interface TransactionRequest {
  club_id: string;
  id: string;
  observation: string;
  value: number;
  methods_transaction: MethodRequest[];
  date_payment?: string;
  user_id?: string;
}

class EditTransactionService {
  async execute({
    id,
    club_id,
    observation,
    value,
    methods_transaction,
    date_payment,
    user_id,
  }: TransactionRequest) {
    if (!id) {
      throw new Error("Id da transação é obrigatório");
    }

    // Executa tudo dentro de uma transação interativa para garantir atomicidade
    return await prismaClient.$transaction(async (tx) => {
      // 1. Buscar a transação existente, incluindo os métodos de pagamento e itens
      const getTransaction = await tx.transaction.findFirst({
        where: {
          id: id,
          club_id: club_id,
        },
        include: {
          methods_transaction: true,
          items_transaction: true,
        },
      });

      if (!getTransaction) {
        throw new Error("Essa cobrança não existe");
      }

      if (!value) {
        throw new Error("Valor é obrigatório");
      }

      // 2. REVERTER os saldos antigos (do clube, dos métodos e do cliente)
      await this.revertSaldos(getTransaction, tx);

      // 3. APLICAR os novos saldos baseados nas alterações
      const operation = getTransaction.operation; // 'entrada' ou 'saida'
      const client_id = getTransaction.client_id;

      let methodsPay = methods_transaction.filter(
        (item) =>
          item.id !== "Crédito" &&
          item.id !== "Pag Dívida" &&
          item.id !== "Saldo",
      );

      let valuePaid = methodsPay.length
        ? methodsPay
            .map((method) => method.value)
            .reduce((total, val) => total + val, 0)
        : 0;

      let valueMethods = methodsPay.length
        ? methodsPay
            .map(
              (method) =>
                method.value * ((100 - (method.percentage || 0)) / 100),
            )
            .reduce((total, val) => total + val, 0)
        : 0;

      // Atualizar o saldo do clube
      const club = await tx.club.findUnique({
        where: { id: club_id },
      });
      if (!club) {
        throw new Error("Clube não encontrado");
      }

      if (operation === "entrada") {
        await tx.club.update({
          where: { id: club_id },
          data: {
            balance: parseFloat((club.balance + valueMethods).toFixed(2)),
          },
        });
      } else {
        await tx.club.update({
          where: { id: club_id },
          data: {
            balance: parseFloat((club.balance - valuePaid).toFixed(2)),
          },
        });
      }

      // Atualizar saldo dos métodos reais
      for (const item of methodsPay) {
        if (item.id) {
          const method = await tx.method.findUnique({
            where: { id: item.id },
          });
          if (!method) {
            throw new Error(
              `Método de pagamento com ID ${item.id} não encontrado`,
            );
          }
          let balance =
            operation === "entrada"
              ? method.balance +
                item.value * ((100 - (item.percentage || 0)) / 100)
              : method.balance -
                item.value * ((100 - (item.percentage || 0)) / 100);
          await tx.method.update({
            where: { id: item.id },
            data: { balance: balance },
          });
        }
      }

      // Atualizar Crédito ou Saldo do cliente
      if (client_id) {
        const client = await tx.client.findUnique({
          where: { id: client_id },
        });
        if (!client) {
          throw new Error("Cliente não encontrado");
        }

        const creditMethod = methods_transaction.find(
          (m) => m.id === "Crédito",
        );
        const saldoMethod = methods_transaction.find((m) => m.id === "Saldo");

        let debtDiff = 0;
        let receiveDiff = 0;

        if (creditMethod) {
          if (operation === "entrada") {
            if (client.debt + creditMethod.value > client.credit) {
              throw new Error("Crédito insuficiente para essa transação");
            }
            debtDiff += creditMethod.value;
          } else {
            debtDiff -= creditMethod.value;
          }
        }

        if (saldoMethod) {
          if (operation === "entrada") {
            if (client.receive < saldoMethod.value) {
              throw new Error("Saldo insuficiente para essa transação");
            }
            receiveDiff -= saldoMethod.value;
          } else {
            receiveDiff += saldoMethod.value;
          }
        }

        if (debtDiff !== 0 || receiveDiff !== 0) {
          await tx.client.update({
            where: { id: client_id },
            data: {
              debt: parseFloat((client.debt + debtDiff).toFixed(2)),
              receive: parseFloat((client.receive + receiveDiff).toFixed(2)),
            },
          });
        }
      }

      // 4. Remover os métodos antigos associados a essa transação
      await tx.methodsTransaction.deleteMany({
        where: {
          transaction_id: id,
        },
      });

      // 5. Criar os novos métodos associados a essa transação
      for (const item of methods_transaction) {
        if (item.value) {
          await tx.methodsTransaction.create({
            data: {
              name: item.name,
              percentage: item.percentage || 0,
              value: item.value,
              transaction_id: id,
              method_id:
                item.method_id ||
                (item.id !== "Saldo" &&
                item.id !== "Pag Dívida" &&
                item.id !== "Crédito"
                  ? item.id
                  : ""),
              user_id: user_id || null,
            },
          });
        }
      }

      let changes: string[] = [];
      if (Number(getTransaction.value) !== Number(value)) {
        changes.push(
          `Valor: R$ ${Number(getTransaction.value).toFixed(2)} -> R$ ${Number(value).toFixed(2)}`,
        );
      }
      if ((getTransaction.observation || "") !== (observation || "")) {
        changes.push(
          `Obs: "${getTransaction.observation || ""}" -> "${observation || ""}"`,
        );
      }
      if (date_payment) {
        const oldDate = getTransaction.date_payment
          ? new Date(getTransaction.date_payment).toISOString().split("T")[0]
          : "-";
        const newDate = new Date(date_payment).toISOString().split("T")[0];
        if (oldDate !== newDate) {
          changes.push(`Data: ${oldDate} -> ${newDate}`);
        }
      }

      const oldMethods =
        getTransaction.methods_transaction
          ?.map((m: any) => `${m.name}: R$ ${Number(m.value).toFixed(2)}`)
          .join(", ") || "";
      const newMethods =
        methods_transaction
          .map((m: any) => `${m.name}: R$ ${Number(m.value).toFixed(2)}`)
          .join(", ") || "";
      if (oldMethods !== newMethods) {
        changes.push(`Métodos: [${oldMethods}] -> [${newMethods}]`);
      }

      if (changes.length > 0) {
        await tx.historicsTransaction.create({
          data: {
            description: changes.join(" | "),
            transaction_id: id,
          },
        });
      }

      // 7. Atualizar a Transação principal e seus itens
      const hasCredit = methods_transaction.some((m) => m.id === "Crédito");
      const valuePaidNew =
        valuePaid +
        (methods_transaction.find((m) => m.id === "Saldo")?.value || 0) +
        (methods_transaction.find((m) => m.id === "Pag Dívida")?.value || 0);
      const paidNew = !hasCredit;

      const updatedTransaction = await tx.transaction.update({
        where: {
          id: id,
        },
        data: {
          observation: observation,
          value: value,
          value_paid: valuePaidNew,
          paid: paidNew,
          date_payment: date_payment
            ? new Date(date_payment)
            : getTransaction.date_payment,
          items_transaction: {
            updateMany: {
              where: {
                transaction_id: id,
              },
              data: {
                value: value,
              },
            },
          },
        },
        include: {
          methods_transaction: true,
          items_transaction: true,
          historics_transaction: {
            orderBy: {
              create_at: "desc",
            },
          },
        },
      });

      return updatedTransaction;
    });
  }

  // Função auxiliar para reverter saldos antigos de uma transação
  private async revertSaldos(txInstance: any, tx: any) {
    const { club_id, client_id, operation, methods_transaction } = txInstance;

    let methodsPay = methods_transaction.filter(
      (item: any) =>
        item.name !== "Crédito" &&
        item.name !== "Pag Dívida" &&
        item.name !== "Saldo",
    );

    let valuePaid = methodsPay.length
      ? methodsPay
          .map((m: any) => m.value)
          .reduce((total: number, val: number) => total + val, 0)
      : 0;

    let valueMethods = methodsPay.length
      ? methodsPay
          .map((m: any) => m.value * ((100 - (m.percentage || 0)) / 100))
          .reduce((total: number, val: number) => total + val, 0)
      : 0;

    const club = await tx.club.findUnique({
      where: { id: club_id },
    });
    if (club) {
      if (operation === "entrada") {
        await tx.club.update({
          where: { id: club_id },
          data: {
            balance: parseFloat((club.balance - valueMethods).toFixed(2)),
          },
        });
      } else {
        await tx.club.update({
          where: { id: club_id },
          data: {
            balance: parseFloat((club.balance + valuePaid).toFixed(2)),
          },
        });
      }
    }

    for (const item of methodsPay) {
      if (item.method_id) {
        const method = await tx.method.findUnique({
          where: { id: item.method_id },
        });
        if (method) {
          let balance = method.balance;
          const valNet = item.value * ((100 - (item.percentage || 0)) / 100);
          if (operation === "entrada") {
            balance -= valNet;
          } else {
            balance += valNet;
          }
          await tx.method.update({
            where: { id: item.method_id },
            data: { balance: balance },
          });
        }
      }
    }

    if (client_id) {
      const client = await tx.client.findUnique({
        where: { id: client_id },
      });
      if (client) {
        const creditMethod = methods_transaction.find(
          (m: any) => m.name === "Crédito",
        );
        const saldoMethod = methods_transaction.find(
          (m: any) => m.name === "Saldo",
        );

        let debtDiff = 0;
        let receiveDiff = 0;

        if (creditMethod) {
          if (operation === "entrada") {
            debtDiff -= creditMethod.value;
          } else {
            debtDiff += creditMethod.value;
          }
        }

        if (saldoMethod) {
          if (operation === "entrada") {
            receiveDiff += saldoMethod.value;
          } else {
            receiveDiff -= saldoMethod.value;
          }
        }

        if (debtDiff !== 0 || receiveDiff !== 0) {
          await tx.client.update({
            where: { id: client_id },
            data: {
              debt: parseFloat((client.debt + debtDiff).toFixed(2)),
              receive: parseFloat((client.receive + receiveDiff).toFixed(2)),
            },
          });
        }
      }
    }
  }
}

export { EditTransactionService };
