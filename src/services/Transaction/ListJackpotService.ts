import prismaClient from '../../prisma'

interface JackpotRequest {
    club_id: string;
    page: number;
}

class ListJackpotService {
    async execute({ club_id, page }: JackpotRequest) {

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                club_id: club_id,
                type: "jackpot",
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
                        type: "jackpot",
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

export { ListJackpotService }