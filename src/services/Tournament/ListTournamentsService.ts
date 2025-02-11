import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    page: number;
    all: boolean;
}

class ListTournamentsService {
    async execute({ club_id, page, all }: TournamentRequest) {

        let filter = {}

        if (!all) {
            filter = {
                skip: page * 30,
                take: 30,
            }
        }

        const tournamentsTotal = await prismaClient.tournament.count({
            where: {
                club_id: club_id,
            },
        })

        const tournaments = await prismaClient.tournament.findMany({
            ...filter,
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