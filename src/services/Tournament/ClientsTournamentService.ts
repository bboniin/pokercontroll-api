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
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                client_tournaments: {
                    where: {
                        tournament_id: tournament_id,
                    },
                    include: {
                        client: true
                    }
                },
            }
        })

        let clientsC = []

        clients.map((item=>{
            if(item.client_tournaments.length){
                clientsC.push({
                    ...item, chair: item.client_tournaments[0].chair_tournament
                }) 
            }
        }))

        return (clientsC)
    }
}

export { ClientsTournamentService }