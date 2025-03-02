import prismaClient from "../../prisma";
import { PaymentDebtsService } from "./PaymentDebtsService";

interface TransactionRequest {
  value: number;
  client_id: string;
  club_id: string;
  club: boolean;
}

class VerifyCreditTransactionService {
  async execute({ value, club_id, client_id, club }: TransactionRequest) {
    const client = await prismaClient.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id,
      },
    });
    if (club) {
      await prismaClient.client.update({
        where: {
          id: client_id,
        },
        data: {
          receive: parseFloat((client.receive + value).toFixed(2)),
        },
      });
    } else {
      if (client.debt + value > client.credit) {
        throw new Error("Crédito insuficiente para essa transação");
      } else {
        await prismaClient.client.update({
          where: {
            id: client_id,
          },
          data: {
            debt: parseFloat((client.debt + value).toFixed(2)),
          },
        });
      }
    }
  }
}

export { VerifyCreditTransactionService };
