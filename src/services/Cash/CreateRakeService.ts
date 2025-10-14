import { format } from "date-fns";
import prismaClient from "../../prisma";
import { getValue } from "../../utils/functions";

interface RakeRequest {
  id: string;
  user_id: string;
  club_id: string;
  value: number;
}

class CreateRakeService {
  async execute({ club_id, value, id, user_id }: RakeRequest) {
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
      throw new Error("Preencha o valor do rake");
    }

    const rake = await prismaClient.rake.create({
      data: {
        historic: `Rake criado por ${user.name} no valor de ${getValue(
          value
        )} em ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        value: value,
        cash_id: id,
      },
    });

    return rake;
  }
}

export { CreateRakeService };
