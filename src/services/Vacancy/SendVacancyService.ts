import prismaClient from "../../prisma";

interface TransactionRequest {
  vacancy_id: string;
  client_id: string;
  club_id: string;
}

class SendVacancyService {
  async execute({ vacancy_id, client_id, club_id }: TransactionRequest) {
    const client = await prismaClient.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id,
      },
    });

    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    const vacancy = await prismaClient.vacancy.findFirst({
      where: {
        id: vacancy_id,
        client_id: null,
      },
    });

    if (!vacancy) {
      throw new Error("Vaga não encontrada ou já enviada");
    }

    await prismaClient.vacancy.update({
      where: {
        id: vacancy_id,
      },
      data: {
        client_id: client.id,
      },
    });

    return "Vaga enviada com sucesso";
  }
}

export { SendVacancyService };
