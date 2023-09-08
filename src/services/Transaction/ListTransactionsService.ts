import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    filter: Object;
}

class ListTransactionsService {
    async execute({ club_id, filter }: TransactionRequest) {

        const transactions = await prismaClient.transaction.findMany({
            where: {
                ...filter, club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (transactions)
    }
}

export { ListTransactionsService }