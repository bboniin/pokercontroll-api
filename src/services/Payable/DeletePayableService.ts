import prismaClient from "../../prisma";

interface PayableRequest {
  payable_id: string;
  club_id: string;
}

class DeletePayableService {
  async execute({ payable_id }: PayableRequest) {
    const payable = await prismaClient.payable.delete({
      where: {
        id: payable_id,
      },
    });

    return payable;
  }
}

export { DeletePayableService };
