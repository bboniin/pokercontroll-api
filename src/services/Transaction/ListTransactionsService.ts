import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
}

class ListTransactionsService {
    async execute({ club_id }: TransactionRequest) {

        const transactions = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    where: {
                        NOT: [{
                            type: "jackpot",
                        },{
                            type: "passport",
                        }]
                    },
                    orderBy: {
                        create_at: "desc"
                    },
                }
            }
        })

        return (transactions)
    }
}

export { ListTransactionsService }