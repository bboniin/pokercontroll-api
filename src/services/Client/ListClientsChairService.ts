import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
}

class ListClientsChairService {
    async execute({ club_id }: ClientRequest) {

        const clients = await prismaClient.client.findMany({
            where: {
                club_id: club_id,
                chair: "",
                visible: true
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (clients)
    }
}

export { ListClientsChairService }