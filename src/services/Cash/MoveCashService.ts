import prismaClient from "../../prisma";

interface CashRequest {
  id: string;
  chair: string;
  cash_id: string;
  club_id: string;
}

class MoveCashService {
  async execute({ id, chair, cash_id }: CashRequest) {
    if (!id || !chair || !cash_id) {
      throw new Error("Id do cliente, posição da mesa e ID da sessão cash são obrigatórios");
    }

    const getChairCash = await prismaClient.clientCash.findFirst({
      where: {
        cash_id: cash_id,
        chair_cash: "C" + chair,
      },
    });

    if (getChairCash) {
      throw new Error("Posição já está sendo ocupada");
    }

    const getClientCash = await prismaClient.clientCash.findFirst({
      where: {
        cash_id: cash_id,
        client_id: id,
      },
    });

    if (getClientCash) {
      const client = await prismaClient.clientCash.update({
        where: {
          id: getClientCash.id,
        },
        data: {
          chair_cash: "C" + chair,
          exit: false,
          date_out: null,
        },
      });
      return client;
    } else {
      const client = await prismaClient.clientCash.create({
        data: {
          chair_cash: "C" + chair,
          cash_id: cash_id,
          client_id: id,
        },
      });
      return client;
    }
  }
}

export { MoveCashService };
