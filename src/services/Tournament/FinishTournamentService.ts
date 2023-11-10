import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    tournament_id: string;
}

class FinishTournamentService {
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

        const clientTournament = await prismaClient.clientTournament.findFirst({
            where: {
                exit: false,
                tournament_id: tournament_id
            }
        })

        console.log(clientTournament)

        if (clientTournament) {
            throw new Error("Elimine todos os jogadores para finalizar o torneio")
        }
        
        const tournamentC = await prismaClient.tournament.update({
            where: {
                id: tournament_id,
            },
            data: {
                status: "encerrado"
            },
            include: {
                clients_tournament: {
                    orderBy: {
                        date_out: "desc"
                    },
                    include: {
                        client: true
                    }
                }
            }
        })

        return tournamentC
    }
}

export { FinishTournamentService }