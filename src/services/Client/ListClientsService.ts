import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
}

class ListClientsService {
    async execute({ club_id }: ClientRequest) {

        const clients = await prismaClient.client.findMany({
            where: {
                club_id: club_id,
                visible: true
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (clients)
    }
}

export { ListClientsService }