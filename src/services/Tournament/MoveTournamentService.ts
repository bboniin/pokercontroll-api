import prismaClient from '../../prisma'

interface TournamentRequest {
    id: string;
    chair: string;
    club_id: string;
}

class MoveTournamentService {
    async execute({ id, chair, club_id }: TournamentRequest) {

        if (!id || !chair) {
            throw new Error("Id do cliente e posição da mesa é obrigatório")
        }

        const chairClient = await prismaClient.client.findFirst({
            where: {
                club_id: club_id,
                chair: "T"+chair
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
                chair: "T"+chair,
            }
        })

        return (client)
    }
}

export { MoveTournamentService }