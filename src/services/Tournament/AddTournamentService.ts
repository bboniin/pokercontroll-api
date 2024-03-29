import prismaClient from '../../prisma'

interface TournamentRequest {
    id: string;
    chair: string;
    club_id: string;
    tournament_id: string;
}

class AddTournamentService {
    async execute({ id, chair, club_id, tournament_id}: TournamentRequest) {

        if (!id || !chair || !tournament_id) {
            throw new Error("Id do cliente, do torneio e posição da mesa é obrigatório")
        }

        const chairClient = await prismaClient.client.findFirst({
            where: {
                club_id: club_id,
                chair: "T"+chair
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

        const client = await prismaClient.client.update({
            where: {
                id: id,
            },
            data: {
                chair: "T"+chair,
            }
        })

        const clientTournament = await prismaClient.clientTournament.create({
            data: {
                client_id: client.id,
                tournament_id: tournament_id,
                date_in: new Date(),
                award: 0
            }
        })

        return ({...client, clientTournament: clientTournament})
    }
}

export { AddTournamentService }