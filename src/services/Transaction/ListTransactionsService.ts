import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    page: number;
}

class ListTransactionsService {
    async execute({ club_id, page }: TransactionRequest) {

        const transactionsTotal = await prismaClient.transaction.count({where: {
            club_id: club_id,
            NOT: [{
                type: "jackpot",
            },{
                type: "passport",
            },{
                type: "dealer",
            }]
        }})
        
        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    skip: page * 30,
                    take: 30,
                    where: {
                        NOT: [{
                            type: "jackpot",
                        },{
                            type: "passport",
                        },{
                            type: "dealer",
                        }]
                    },
                    orderBy: {
                        create_at: "desc"
                    },
                    include: {
                        methods_transaction: true,
                        items_transaction: true
                    }
                }
            }
        })

        club["transactionsTotal"] = transactionsTotal

        return (club)
    }
}

export { ListTransactionsService }