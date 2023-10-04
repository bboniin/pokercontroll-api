import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    tournament_id: string;
}

class InitialTournamentService {
    async execute({ tournament_id, club_id}: TournamentRequest) {

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
                status: "inscricao",
                datetime_initial: new Date()
            },
            include: {
                clients_tournament: true,
            }
        })

        return tournamentC
    }
}

export { InitialTournamentService }