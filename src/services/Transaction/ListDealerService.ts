import prismaClient from '../../prisma'

interface DealerRequest {
    club_id: string;
}

class ListDealerService {
    async execute({ club_id }: DealerRequest) {

        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    where: {
                        type: "dealer"
                    },
                    orderBy: {
                        create_at: "desc"
                    },
                }
            }
        })

        return (club)
    }
}

export { ListDealerService }