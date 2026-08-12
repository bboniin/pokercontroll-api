import prismaClient from "../../prisma";

interface CashRequest {
  client_id: string;
  club_id: string;
  cash_id: string;
}

class ExitClientCashService {
  async execute({ client_id, cash_id, club_id }: CashRequest) {
    if (!client_id) {
      throw new Error("Id do cliente é obrigatório");
    }

    const cash = await prismaClient.cash.findFirst({
      where: {
        club_id: club_id,
        id: cash_id,
      },
    });

    if (!cash) {
      throw new Error("Sessão cash não encontrada");
    }

    const chairClient = await prismaClient.clientCash.findFirst({
      where: {
        client_id: client_id,
        cash_id: cash_id,
        chair_cash: {
          contains: "C",
        },
      },
    });

    if (!chairClient) {
      throw new Error("Cliente não foi encontrado");
    }

    const client = await prismaClient.clientCash.update({
      where: {
        id: chairClient.id,
      },
      data: {
        chair_cash: "",
        exit: true,
        date_out: new Date(),
      },
    });

    return client;
  }
}

export { ExitClientCashService };
