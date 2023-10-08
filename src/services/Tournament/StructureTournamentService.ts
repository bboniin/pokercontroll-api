import prismaClient from '../../prisma'

interface TournamentRequest {
    intervals: string;
    blinds: string;
    club_id: string;
    tournament_id: string;
}

class StructureTournamentService {
    async execute({ club_id, intervals, blinds, tournament_id }: TournamentRequest) {

        if (!tournament_id || !blinds || !intervals || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const tournament = await prismaClient.tournament.findFirst({
            where: {
                id: tournament_id,
                club_id: club_id,
            }
        })

        if (!tournament) {
            throw new Error("Torneio não encontrado")
        }
        const tournamentEdit = await prismaClient.tournament.update({
            where: {
                id: tournament_id,
            },
            data: {
                blinds: blinds,
                intervals: intervals
            }
        })

        return (tournamentEdit)
    }
}

export { StructureTournamentService }