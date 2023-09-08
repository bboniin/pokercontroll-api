import prismaClient from '../../prisma'

interface CashRequest {
    client_id: string;
    club_id: string;
}

class ExitClientCashService {
    async execute({ client_id, club_id }: CashRequest) {

        if (!client_id) {
            throw new Error("Id do cliente é obrigatório")
        }

        const chairClient = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id,
                chair: {
                    contains: "C"
                }
            }
        })

        if (!chairClient) {
            throw new Error("Cliente não foi encontrado")
        }

        const client = await prismaClient.client.update({
            where: {
                id: client_id,
            },
            data: {
                chair: "",
            }
        })

        return (client)
    }
}

export { ExitClientCashService }