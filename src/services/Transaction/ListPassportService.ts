import prismaClient from '../../prisma'

interface PassportRequest {
    club_id: string;
    page: number;
}

class ListPassportService {
    async execute({ club_id, page }: PassportRequest) {

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                club_id: club_id,
                type: "passport",
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
                        type: "passport",
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

export { ListPassportService }