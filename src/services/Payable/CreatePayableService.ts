import { addDays, addMonths, addYears } from "date-fns";
import prismaClient from "../../prisma";

interface PayableRequest {
  name: string;
  club_id: string;
  value: number;
  installments: number;
  period: string;
  observation: string;
  account: string;
  recurrence: boolean;
}

function periodToDays(period) {
  switch (period) {
    case "semanal": {
      return addDays(new Date(), 7);
    }
    case "quinzenal": {
      return addDays(new Date(), 15);
    }
    case "mensal": {
      return addMonths(new Date(), 1);
    }
    case "bimestral": {
      return addMonths(new Date(), 2);
    }
    case "trimestral": {
      return addMonths(new Date(), 3);
    }
    case "semestral": {
      return addMonths(new Date(), 6);
    }
    case "anual": {
      return addYears(new Date(), 1);
    }
    default: {
      throw new Error("Periodo selecionado é inválido");
    }
  }
}

class CreatePayableService {
  async execute({
    name,
    club_id,
    value,
    period,
    installments,
    account,
    observation,
    recurrence,
  }: PayableRequest) {
    if (
      !account ||
      !value ||
      !period ||
      (!recurrence && !installments) ||
      !name ||
      !club_id
    ) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const date_charge = periodToDays(period);

    const payable = await prismaClient.payable.create({
      data: {
        name: name,
        value: value,
        period: period,
        installments: recurrence ? 0 : installments,
        observation: observation,
        installmentsPaid: 1,
        account: account,
        recurrence: recurrence,
        date_charge: date_charge,
        club_id: club_id,
      },
    });

    const transaction = await prismaClient.transaction.create({
      data: {
        type: account,
        value: value,
        club_id: club_id,
        operation: "saida",
        date_payment: new Date(),
        observation: recurrence
          ? "Cobrança recorrente"
          : `1/${installments} parcelas`,
        paid: false,
        value_paid: 0,
        sector_id: payable.id,
        items_transaction: {
          create: [
            {
              name: name,
              value: value,
              amount: 1,
            },
          ],
        },
      },
    });

    return transaction;
  }
}

export { CreatePayableService };
