import prismaClient from '../../prisma'

interface PassportRequest {
    club_id: string;
}

class ListPassportService {
    async execute({ club_id }: PassportRequest) {

        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    where: {
                        type: "passport"
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

export { ListPassportService }