import { addMonths } from "date-fns";
import prismaClient from "../../prisma";

interface TransactionRequest {
  vacancy_id: string;
  club_id: string;
  client_id: string;
}

class RescueVacancyService {
  async execute({ vacancy_id, club_id, client_id }: TransactionRequest) {
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
        rescue: false,
      },
    });

    if (!vacancy) {
      throw new Error("Vaga não encontrada ou já utilizada");
    }

    const transaction = await prismaClient.transaction.create({
      data: {
        type: "clube",
        value: vacancy.value,
        club_id: club_id,
        client_id: client_id,
        operation: "saida",
        date_payment: addMonths(new Date(), 1),
        observation: "",
        paid: false,
        value_paid: 0,
      },
    });

    await prismaClient.itemsTransaction.create({
      data: {
        name: "Resgate Vaga",
        value: vacancy.value,
        amount: 1,
        transaction_id: transaction.id,
      },
    });

    await prismaClient.client.update({
      where: {
        id: client_id,
      },
      data: {
        receive: parseFloat((client.receive + vacancy.value).toFixed(2)),
      },
    });

    await prismaClient.vacancy.update({
      where: {
        id: vacancy_id,
      },
      data: {
        rescue: true,
        date_rescue: new Date(),
      },
    });

    return "Vaga utilizada com sucesso";
  }
}

export { RescueVacancyService };
