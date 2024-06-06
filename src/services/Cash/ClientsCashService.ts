import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
}

class ClientsCashService {
    async execute({ club_id }: ClientRequest) {

        const clients = await prismaClient.client.findMany({
            where: {
                club_id: club_id,
                chair_cash: {
                    contains: "C"
                }
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (clients)
    }
}

export { ClientsCashService }