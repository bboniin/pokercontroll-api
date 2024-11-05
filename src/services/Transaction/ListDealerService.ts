import prismaClient from '../../prisma'

interface DealerRequest {
    club_id: string;
    page: number;
}

class ListDealerService {
    async execute({ club_id, page }: DealerRequest) {

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                club_id: club_id,
                type: "dealer",
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
                    where: {
                        type: "dealer",
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

export { ListDealerService }