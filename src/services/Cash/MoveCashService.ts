import prismaClient from '../../prisma'

interface CashRequest {
    id: string;
    chair: string;
    club_id: string;
}

class MoveCashService {
    async execute({ id, chair, club_id }: CashRequest) {

        if (!id || !chair) {
            throw new Error("Id do cliente e posição da mesa é obrigatório")
        }

        const chairClient = await prismaClient.client.findFirst({
            where: {
                club_id: club_id,
                chair: "C"+chair
            }
        })

        if (chairClient) {
            throw new Error("Posição já está sendo ocupada")
        }

        const client = await prismaClient.client.update({
            where: {
                id: id,
            },
            data: {
                chair: "C"+chair,
            }
        })

        return (client)
    }
}

export { MoveCashService }