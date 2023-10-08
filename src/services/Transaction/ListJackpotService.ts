import prismaClient from '../../prisma'

interface JackpotRequest {
    club_id: string;
}

class ListJackpotService {
    async execute({ club_id }: JackpotRequest) {

        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    where: {
                        type: "jackpot"
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

export { ListJackpotService }