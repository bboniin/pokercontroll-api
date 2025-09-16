import prismaClient from "../../prisma";

interface BoxRequest {
  value_initial: number;
  club_id: string;
  user_id: string;
}

class StartFinancialBoxService {
  async execute({ user_id, club_id, value_initial }: BoxRequest) {
    if (!user_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const financialBoxOpen = await prismaClient.financialBox.findFirst({
      where: {
        user_id: user_id,
        club_id: club_id,
        closed: false,
      },
    });

    if (financialBoxOpen) {
      throw new Error(
        "Já existe um caixa aberto no momento, não é possivel abrir outro"
      );
    }

    const financialBox = await prismaClient.financialBox.create({
      data: {
        club_id: club_id,
        value_initial: value_initial || 0,
        user_id: user_id,
        closed: false,
      },
    });

    return financialBox;
  }
}

export { StartFinancialBoxService };
