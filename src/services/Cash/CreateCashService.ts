import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface CashRequest {
  name: string;
  chairs: number;
  club_id: string;
  briefcase: number;
  user_id: string;
}

class CreateCashService {
  async execute({ club_id, briefcase, user_id, name, chairs }: CashRequest) {
    const cashGet = await prismaClient.cash.findFirst({
      where: {
        club_id: club_id,
        closed: false,
      },
    });
    if (cashGet) {
      throw new Error("Já existe sessão cashgame iniciada");
    }

    if (!briefcase || !name) {
      throw new Error("Preencha o valor da maleta e nome do cashgame");
    }

    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
        club_id: club_id,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const cash = await prismaClient.cash.create({
      data: {
        name: name,
        club_id: club_id,
        chairs: chairs || 15,
        briefcase: briefcase,
        historic_briefcase: `Maleta criada por ${
          user.name
        } no valor de ${getValue(briefcase)} em ${format(
          new Date(),
          "dd/MM/yyyy HH:mm"
        )}`,
        closed: false,
        date_in: new Date(),
      },
    });

    return cash;
  }
}

export { CreateCashService };
