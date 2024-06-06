import prismaClient from '../../prisma'

interface CashRequest {
    id: string;
    chair: string;
    chair_initial: string;
    club_id: string;
}

class MoveCashService {
    async execute({ id, chair, chair_initial, club_id }: CashRequest) {

        if (!id || !chair) {
            throw new Error("Id do cliente e posição da mesa é obrigatório")
        }

        const chairClient = await prismaClient.client.findFirst({
            where: {
                club_id: club_id,
                chair_cash: "C"+chair
            }
        })

        if (chairClient && !chair_initial) {
            throw new Error("Posição já está sendo ocupada")
        }

        if (chairClient && chair_initial) {
            await prismaClient.client.update({
                where: {
                    id: chairClient.id,
                },
                data: {
                    chair_cash: "C"+chair_initial,
                }
            })
        }

        const client = await prismaClient.client.update({
            where: {
                id: id,
            },
            data: {
                chair_cash: "C"+chair,
            }
        })

        return (client)
    }
}

export { MoveCashService }