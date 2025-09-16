import prismaClient from "../../prisma";

interface BoxRequest {
  user_id: string;
  box_id: string;
  club_id: string;
}

class EndFinancialBoxService {
  async execute({ user_id, club_id, box_id }: BoxRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const financialBox = await prismaClient.financialBox.findFirst({
      where: {
        id: box_id,
        club_id: club_id,
      },
    });

    if (!financialBox) {
      throw new Error("Caixa não encontrado");
    }

    if (financialBox.closed) {
      throw new Error("Caixa já finalizado");
    }

    const financialBoxEnd = await prismaClient.financialBox.update({
      where: {
        id: box_id,
      },
      data: {
        date_end: new Date(),
        closed: true,
      },
    });

    return financialBoxEnd;
  }
}

export { EndFinancialBoxService };
