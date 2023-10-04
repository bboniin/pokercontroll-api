import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
}

class ListTournamentsService {
    async execute({ club_id }: TournamentRequest) {

        const tournaments = await prismaClient.tournament.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (tournaments)
    }
}

export { ListTournamentsService }