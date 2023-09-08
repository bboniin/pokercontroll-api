import prismaClient from '../../prisma'

interface ClientRequest {
    client_id: string;
    club_id: string;
}

class DeleteClientService {
    async execute({ client_id, club_id }: ClientRequest) {

        const client = await prismaClient.client.update({
            where: {
                id: client_id,
            },
            data: {
                visible: false,
                chair: ""
            }
        })
        return (client)
    }
}

export { DeleteClientService }