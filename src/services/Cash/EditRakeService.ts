import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface RakeRequest {
  id: string;
  user_id: string;
  club_id: string;
  value: number;
}

class EditRakeService {
  async execute({ club_id, value, id, user_id }: RakeRequest) {
    const rakeGet = await prismaClient.rake.findFirst({
      where: {
        id: id,
        cash: {
          club_id: club_id,
        },
      },
    });

    if (!rakeGet) {
      throw new Error("Rake não encontrado");
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
      throw new Error("Preencha o valor do rake");
    }

    const rake = await prismaClient.rake.update({
      where: {
        id: id,
      },
      data: {
        historic:
          rakeGet.historic +
          `\nRake editado por ${user.name} no valor de ${getValue(
            rakeGet.value
          )} para ${getValue(value)} em ${format(
            new Date(),
            "dd/MM/yyyy HH:mm"
          )}`,
        value: value,
      },
    });

    return rake;
  }
}

export { EditRakeService };
