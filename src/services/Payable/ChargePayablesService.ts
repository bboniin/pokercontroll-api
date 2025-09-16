import { addDays, addMonths, addYears, endOfDay } from "date-fns";
import prismaClient from "../../prisma";

interface PayableRequest {
  user_id: string;
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

class ChargePayablesService {
  async execute({ user_id }: PayableRequest) {
    const payables = await prismaClient.payable.findMany({
      where: {
        date_charge: {
          lt: endOfDay(addDays(new Date(), 1)),
        },
      },
    });

    await Promise.all(
      await payables.map(async (payable) => {
        await prismaClient.transaction.create({
          data: {
            type: payable.account,
            value: payable.value,
            club_id: payable.club_id,
            operation: "saida",
            date_payment: new Date(),
            observation: payable.recurrence
              ? "Cobrança recorrente"
              : `${payable.installmentsPaid + 1}/${
                  payable.installments
                } parcelas`,
            paid: false,
            value_paid: 0,
            sector_id: payable.id,
            user_id: user_id,
            items_transaction: {
              create: [
                {
                  name: payable.name,
                  value: payable.value,
                  amount: 1,
                },
              ],
            },
          },
        });

        await prismaClient.payable.update({
          where: { id: payable.id },
          data: {
            installmentsPaid: payable.installmentsPaid + 1,
            date_charge: periodToDays(payable.period),
          },
        });
      })
    );

    return "Cobranças criadas";
  }
}

export { ChargePayablesService };
