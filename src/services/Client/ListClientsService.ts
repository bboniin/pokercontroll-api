import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
    page: number;
    all: boolean;
}

class ListClientsService {
    async execute({ club_id, page, all }: ClientRequest) {
        
        let filter = {}

        if (!all) {
            filter = {
                skip: page * 30,
                take: 30,
            }
        }

        const clientsTotal = await prismaClient.client.count({
            where: {
                club_id: club_id,
                visible: true
            },
        })

        const clients = await prismaClient.client.findMany({
            ...filter,
            where: {
                club_id: club_id,
                visible: true
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return ({clients, clientsTotal})
    }
}

export { ListClientsService }