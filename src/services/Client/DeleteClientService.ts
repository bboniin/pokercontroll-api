import prismaClient from "../../prisma";

interface ClientRequest {
  client_id: string;
  club_id: string;
  user_id: string;
}

class DeleteClientService {
  async execute({ client_id, club_id, user_id }: ClientRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
        club_id: club_id,
        type: "admin",
      },
    });

    if (!user) {
      throw new Error("Rota restrita para administrador");
    }

    const client = await prismaClient.client.update({
      where: {
        id: client_id,
      },
      data: {
        visible: false,
      },
    });
    return client;
  }
}

export { DeleteClientService };
