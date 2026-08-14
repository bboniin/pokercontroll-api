import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface JackpotRequest {
  id: string; // representa o jackpot_id
  user_id: string;
  club_id: string;
  value: number;
}

class EditJackpotCashService {
  async execute({ club_id, value, id, user_id }: JackpotRequest) {
    const jackpotGet = await prismaClient.jackpot.findFirst({
      where: {
        id: id,
        cash: {
          club_id: club_id,
        },
      },
    });

    if (!jackpotGet) {
      throw new Error("Jackpot não encontrado");
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

    const jackpot = await prismaClient.jackpot.update({
      where: {
        id: id,
      },
      data: {
        historic:
          jackpotGet.historic +
          `\nJackpot editado por ${user.name} no valor de ${getValue(
            jackpotGet.value
          )} para ${getValue(value)} em ${format(
            new Date(),
            "dd/MM/yyyy HH:mm"
          )}`,
        value: value,
      },
    });

    return jackpot;
  }
}

export { EditJackpotCashService };
