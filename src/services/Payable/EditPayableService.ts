import prismaClient from "../../prisma";

interface PayableRequest {
  name: string;
  club_id: string;
  value: number;
  installments: number;
  payable_id: string;
  observation: string;
  period: string;
  installmentsPaid: number;
  active: boolean;
  account: string;
  recurrence: boolean;
  date_charge: Date;
  value_estimated: boolean;
}

class EditPayableService {
  async execute({
    name,
    club_id,
    value,
    period,
    installments,
    payable_id,
    observation,
    account,
    installmentsPaid,
    active,
    recurrence,
    date_charge,
    value_estimated,
  }: PayableRequest) {
    if (
      !payable_id ||
      !value ||
      !period ||
      (!recurrence && !installments) ||
      !account ||
      !name ||
      !club_id ||
      !date_charge
    ) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const payable = await prismaClient.payable.findFirst({
      where: {
        id: payable_id,
        club_id: club_id,
      },
    });

    if (!payable) {
      throw new Error("Despesa recorrente não encontrada");
    }

    const payableEdit = await prismaClient.payable.update({
      where: {
        id: payable_id,
      },
      data: {
        name: name,
        value: value,
        period: period,
        active: active,
        account: account,
        installments: recurrence ? 0 : installments,
        observation: observation,
        recurrence: recurrence,
        date_charge: date_charge,
        value_estimated: value_estimated,
        installmentsPaid: recurrence ? 0 : installmentsPaid || 1,
      },
    });

    return payableEdit;
  }
}

export { EditPayableService };
