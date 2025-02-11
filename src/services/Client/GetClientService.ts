import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
    client_id: string;
    page: number;
}

class GetClientService {
    async execute({ client_id, club_id, page}: ClientRequest) {

        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id,
                visible: true
            },
            include: {
                transactions: {
                    skip: page * 30,
                    take: 30,
                    orderBy: {
                        create_at: "desc"
                    },
                    include: {
                        methods_transaction: true,
                        items_transaction: true
                    }
                },
                client_tournaments: true
            }
        })

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                client_id: client_id,
                club_id: club_id,
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrado")
        }

        return ({client, transactionsTotal})
    }
}

export { GetClientService }