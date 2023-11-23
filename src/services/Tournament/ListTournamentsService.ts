import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    page: number;
}

class ListTournamentsService {
    async execute({ club_id, page }: TournamentRequest) {

        const tournamentsTotal = await prismaClient.tournament.count({
            where: {
                club_id: club_id,
            },
        })

        const tournaments = await prismaClient.tournament.findMany({
            skip: page * 30,
            take: 30,
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "desc",
            }
        })

        return {tournaments, tournamentsTotal}
    }
}

export { ListTournamentsService }