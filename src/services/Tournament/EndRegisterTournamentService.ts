import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    award: string;
    tournament_id: string;
}

class EndRegisterTournamentService {
    async execute({ tournament_id, club_id, award}: TournamentRequest) {

        if (!award) {
            throw new Error("Modelo de recompensa é obrigátorio")
        }
        const tournament = await prismaClient.tournament.findFirst({
            where: {
                club_id: club_id,
                id: tournament_id
            }
        })

        if (!tournament) {
            throw new Error("Torneio não encontrado")
        }

        const tournamentC = await prismaClient.tournament.update({
            where: {
                id: tournament_id,
            },
            data: {
                status: "final",
                award: award,
            },
            include: {
                clients_tournament: true,
            }
        })

        return tournamentC
    }
}

export { EndRegisterTournamentService }