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
       
        return tournament
    }
}

export { GetTournamentService }