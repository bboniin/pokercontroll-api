import prismaClient from "../../prisma";

interface DeleteRequest {
  id: string;
  club_id: string;
}

class DeleteTransactionService {
  async execute({ id, club_id }: DeleteRequest) {
    if (!id) {
      throw new Error("Id da transação é obrigatório");
    }

    return await prismaClient.$transaction(async (tx) => {
      // 1. Buscar a transação existente
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

      // 2. REVERTER os saldos (do clube, dos métodos e do cliente)
      await this.revertSaldos(getTransaction, tx);

      // 3. DELETAR a transação
      // (a remoção em cascata cuidará dos itens e métodos correspondentes se onDelete for Cascade,
      // mas podemos deletá-los explicitamente por segurança adicional)
      await tx.methodsTransaction.deleteMany({
        where: { transaction_id: id }
      });

      await tx.itemsTransaction.deleteMany({
        where: { transaction_id: id }
      });

      await tx.transaction.delete({
        where: {
          id: id,
        },
      });

      return { message: "Transação deletada com sucesso" };
    });
  }

  // Função auxiliar para reverter saldos
  private async revertSaldos(txInstance: any, tx: any) {
    const { club_id, client_id, operation, methods_transaction } = txInstance;

    let methodsPay = methods_transaction.filter(
      (item: any) =>
        item.name !== "Crédito" &&
        item.name !== "Pag Dívida" &&
        item.name !== "Saldo"
    );

    let valuePaid = methodsPay.length
      ? methodsPay
          .map((m: any) => m.value)
          .reduce((total: number, val: number) => total + val, 0)
      : 0;

    let valueMethods = methodsPay.length
      ? methodsPay
          .map(
            (m: any) => m.value * ((100 - (m.percentage || 0)) / 100)
          )
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
        const creditMethod = methods_transaction.find((m: any) => m.name === "Crédito");
        const saldoMethod = methods_transaction.find((m: any) => m.name === "Saldo");

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

export { DeleteTransactionService };
