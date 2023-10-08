import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
}

class ListTournamentsService {
    async execute({ club_id }: TournamentRequest) {

        const tournament = await prismaClient.tournament.findFirst({
            where: {
                club_id: club_id,
                OR: [{
                    status: "inscricao"
                },{
                    status: "final"
                }]
            },
            orderBy: {
                create_at: "asc"
            }
        })

        const tournaments = await prismaClient.tournament.findMany({
            where: {
                club_id: club_id,
                NOT: [{
                    status: "inscricao"
                },{
                    status: "final"
                }]
            },
            orderBy: {
                create_at: "desc",
            }
        })

        return tournament ? [tournament, ...tournaments] : tournaments
    }
}

export { ListTournamentsService }