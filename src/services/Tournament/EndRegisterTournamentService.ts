import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    award: string;
    staff: number;
    tournament_id: string;
}

class EndRegisterTournamentService {
    async execute({ tournament_id, club_id, award, staff}: TournamentRequest) {

        if (!award) {
            throw new Error("Modelo de recompensa é obrigátorio")
        }
        const tournament = await prismaClient.tournament.findFirst({
            where: {
                club_id: club_id,
                id: tournament_id,
                OR: [{
                    status: "inscricao"
                },{
                    status: "final"
                }]
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
                staff: staff
            },
            include: {
                clients_tournament: true,
            }
        })

        return tournamentC
    }
}

export { EndRegisterTournamentService }