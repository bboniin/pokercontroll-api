import prismaClient from '../../prisma'

interface TournamentRequest {
    id: string;
    club_id: string;
}

class GetTournamentService {
    async execute({ id, club_id }: TournamentRequest) {

        if (!id || !club_id) {
            throw new Error("Envie o id do produto e do clube")
        }

        const tournament = await prismaClient.tournament.findFirst({
                where: {
                    id: id,
                    club_id: club_id
            },
            include: {
                clients_tournament: true
            }
        })
       
        return tournament
    }
}

export { GetTournamentService }