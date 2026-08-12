import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface CaixinhaRequest {
  id: string;
  user_id: string;
  club_id: string;
  observation: string;
  value: number;
}

class CreateCaixinhaService {
  async execute({ club_id, value, observation, id, user_id }: CaixinhaRequest) {
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
      throw new Error("Preencha o valor da caixinha");
    }

    const box = await prismaClient.box.create({
      data: {
        historic: `Caixinha criada por ${user.name} no valor de ${getValue(
          value,
        )} em ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        value: value,
        cash_id: id,
        observation: observation,
      },
    });

    return box;
  }
}

export { CreateCaixinhaService };
