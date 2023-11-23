import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    page: number;
    type: string;
}

class ListTransactionsService {
    async execute({ club_id, page, type }: TransactionRequest) {

        let typeWhere = type ? {  type: type } : {}

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                ...typeWhere,
                club_id: club_id,
            }
        })
        
        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    skip: page * 30,
                    take: 30,
                    where: typeWhere,
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