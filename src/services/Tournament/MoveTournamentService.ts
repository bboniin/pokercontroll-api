import prismaClient from '../../prisma'

interface TournamentRequest {
    id: string;
    tournament_id: string;
    chair: string;
}

class MoveTournamentService {
    async execute({ id, chair, tournament_id }: TournamentRequest) {

        if (!id || !tournament_id || !chair) {
            throw new Error("Id do cliente, torneio e posição na mesa é obrigatório")
        }

        const chairClient = await prismaClient.clientTournament.findFirst({
            where: {
                tournament_id: tournament_id,
                chair_tournament: "T"+chair
            }
        })

        if (chairClient) {
            throw new Error("Posição já está sendo ocupada")
        }

        const getClient = await prismaClient.clientTournament.findFirst({
            where: {
                tournament_id: tournament_id,
                client_id: id,
            }
        })

        const client = await prismaClient.clientTournament.update({
            where: {
                id: getClient.id,
            },
            data: {
                chair_tournament: "T"+chair,
            }
        })

        return (client)
    }
}

export { MoveTournamentService }