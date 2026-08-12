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

class EditCaixinhaService {
  async execute({ club_id, value, observation, id, user_id }: CaixinhaRequest) {
    const boxGet = await prismaClient.box.findFirst({
      where: {
        id: id,
        cash: {
          club_id: club_id,
        },
      },
    });

    if (!boxGet) {
      throw new Error("box não encontrada");
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
      throw new Error("Preencha o valor da box");
    }

    const box = await prismaClient.box.update({
      where: {
        id: id,
      },
      data: {
        historic:
          boxGet.historic +
          `\nCaixinha editada por ${user.name} no valor de ${getValue(
            boxGet.value,
          )} para ${getValue(value)} em ${format(
            new Date(),
            "dd/MM/yyyy HH:mm",
          )}`,
        value: value,
        observation: observation,
      },
    });

    return box;
  }
}

export { EditCaixinhaService };
