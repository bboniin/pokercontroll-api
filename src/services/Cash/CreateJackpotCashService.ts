import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface JackpotRequest {
  id: string; // representa o cash_id
  user_id: string;
  club_id: string;
  value: number;
}

class CreateJackpotCashService {
  async execute({ club_id, value, id, user_id }: JackpotRequest) {
    const cash = await prismaClient.cash.findFirst({
      where: {
        id: id,
        club_id: club_id,
      },
    });

    if (!cash) {
      throw new Error("Cashgame não encontrado");
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

    if (!value) {
      throw new Error("Preencha o valor do jackpot");
    }

    const jackpot = await prismaClient.jackpot.create({
      data: {
        historic: `Jackpot criado por ${user.name} no valor de ${getValue(
          value
        )} em ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        value: value,
        cash_id: id,
      },
    });

    return jackpot;
  }
}

export { CreateJackpotCashService };
