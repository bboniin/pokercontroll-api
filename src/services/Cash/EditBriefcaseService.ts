import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface BriefcaseRequest {
  id: string;
  user_id: string;
  club_id: string;
  value: number;
}

class EditBriefcaseService {
  async execute({ club_id, value, id, user_id }: BriefcaseRequest) {
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
      throw new Error("Preencha o valor do maleta");
    }

    const briefcase = await prismaClient.cash.update({
      where: {
        id: id,
      },
      data: {
        historic_briefcase:
          cash.historic_briefcase +
          `\nMaleta editada por ${user.name} no valor de ${getValue(
            cash.briefcase
          )} para ${getValue(value)} em ${format(
            new Date(),
            "dd/MM/yyyy HH:mm"
          )}`,
        briefcase: value,
      },
    });

    return briefcase;
  }
}

export { EditBriefcaseService };
