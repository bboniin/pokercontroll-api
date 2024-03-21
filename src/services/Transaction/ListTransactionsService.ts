import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    page: number;
    filter: object;
    type: string;
}

class ListTransactionsService {
    async execute({ club_id, page, type, filter }: TransactionRequest) {

        let typeWhere = type ? { type: type } : {}
        
        if (!filter) {
            filter = {}
        }

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                ...typeWhere,
                ...filter,
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
                    where: {...typeWhere, ...filter},
                    orderBy: {
                        create_at: "desc"
                    },
                    include: {
                        methods_transaction: true,
                        items_transaction: true,
                    }
                }
            }
        })

        club["transactionsTotal"] = transactionsTotal

        return (club)
    }
}

export { ListTransactionsService }