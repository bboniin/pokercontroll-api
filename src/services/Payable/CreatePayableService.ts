import {
  addDays,
  addMonths,
  addYears,
  isToday,
  isTomorrow,
  startOfDay,
} from "date-fns";
import prismaClient from "../../prisma";

interface PayableRequest {
  name: string;
  club_id: string;
  value: number;
  installments: number;
  period: string;
  observation: string;
  account: string;
  date_charge: Date;
  recurrence: boolean;
  value_estimated: boolean;
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
    date_charge,
    recurrence,
    value_estimated,
  }: PayableRequest) {
    if (
      !account ||
      !value ||
      !period ||
      (!recurrence && !installments) ||
      !name ||
      !date_charge ||
      !club_id
    ) {
      throw new Error("Preencha os campos obrigatórios");
    }

    date_charge = startOfDay(new Date(date_charge));

    let newDateCharge = date_charge;

    if (isToday(date_charge) || isTomorrow(date_charge)) {
      newDateCharge = periodToDays(period);
    }

    const payable = await prismaClient.payable.create({
      data: {
        name: name,
        value: value,
        period: period,
        installments: recurrence ? 0 : installments,
        observation: observation,
        installmentsPaid: newDateCharge != date_charge ? 1 : 0,
        account: account,
        recurrence: recurrence,
        date_charge: newDateCharge,
        value_estimated: value_estimated,
        club_id: club_id,
      },
    });

    if (newDateCharge != date_charge) {
      await prismaClient.transaction.create({
        data: {
          type: account,
          value: value,
          club_id: club_id,
          operation: "saida",
          date_payment: date_charge,
          observation: recurrence
            ? "Cobrança recorrente"
            : `1/${installments} parcelas`,
          paid: false,
          value_paid: 0,
          editable: value_estimated,
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
    }

    return "Despesa recorrente criada";
  }
}

export { CreatePayableService };
