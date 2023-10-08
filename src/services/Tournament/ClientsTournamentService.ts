import prismaClient from '../../prisma'

interface ClientRequest {
    club_id: string;
    tournament_id: string;
}

class ClientsTournamentService {
    async execute({ club_id, tournament_id}: ClientRequest) {

        const clients = await prismaClient.client.findMany({
            where: {
                club_id: club_id,
                chair: {
                    contains: "T"
                }
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                client_tournaments: {
                    where: {
                        tournament_id: tournament_id,
                    },
                },
            }
        })

        return (clients)
    }
}

export { ClientsTournamentService }