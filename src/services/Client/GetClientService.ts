import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
    client_id: string;
}

class GetClientService {
    async execute({ client_id, club_id}: ClientRequest) {

        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id,
                visible: true
            },
            include: {
                transactions: true
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrado")
        }

        return (client)
    }
}

export { GetClientService }