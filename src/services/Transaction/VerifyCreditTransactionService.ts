import prismaClient from '../../prisma'

interface TransactionRequest {
    value: number;
    client_id: string;
    club_id: string;
}


class VerifyCreditTransactionService {
    async execute({ value, club_id, client_id }: TransactionRequest) {

        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id
            }
        })
        if (value != 0) {
            if (((client.balance - value) * -1) > client.credit) {
                throw new Error("Crédito insuficiente para essa transação")
            } else {
                return true
            }
        } else {
            return true
        }

    }
}

export { VerifyCreditTransactionService }