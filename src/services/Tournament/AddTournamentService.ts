import prismaClient from '../../prisma'

interface TournamentRequest {
    id: string;
    chair: string;
    tournament_id: string;
}

class AddTournamentService {
    async execute({ id, chair, tournament_id}: TournamentRequest) {

        if (!id || !chair || !tournament_id) {
            throw new Error("Id do cliente, do torneio e posição da mesa é obrigatório")
        }

        const chairClient = await prismaClient.clientTournament.findFirst({
            where: {
                tournament_id: tournament_id,
                chair_tournament: "T"+chair
            }
        })

        const clientTournamentGet = await prismaClient.clientTournament.findFirst({
            where: {
                client_id: id,
                tournament_id: tournament_id,
        }})

        if (clientTournamentGet) {
            throw new Error("Cliente já participou desse torneio e foi eliminado")
        }

        if (chairClient) {
            throw new Error("Posição já está sendo ocupada")
        }

        await prismaClient.clientTournament.create({
            data: {
                client_id: id,
                tournament_id: tournament_id,
                date_in: new Date(),
                award: 0,
                chair_tournament: "T"+chair,
            }
        })

        return true
    }
}

export { AddTournamentService }