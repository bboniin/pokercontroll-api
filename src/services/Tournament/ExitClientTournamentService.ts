import prismaClient from '../../prisma'

interface TournamentRequest {
    client_id: string;
    club_id: string;
    tournament_id: string;
}

class ExitClientTournamentService {
    async execute({ client_id, club_id, tournament_id }: TournamentRequest) {

        if (!client_id || !tournament_id) {
            throw new Error("Id do cliente e do torneio é obrigatório")
        }

        const chairClient = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id,
                chair: {
                    contains: "T"
                }
            }
        })

        if (!chairClient) {
            throw new Error("Cliente não foi encontrado")
        }

        const client = await prismaClient.client.update({
            where: {
                id: client_id,
            },
            data: {
                chair: "",
            }
        })

        const clientTournament = await prismaClient.clientTournament.findFirst({
            where: {
                client_id: client.id,
                tournament_id: tournament_id,
        }})

        await prismaClient.clientTournament.update({
            where: {
                id: clientTournament.id,
            },
            data: {
                date_out: new Date(),
                exit: true,
                award: 0
            }
        })

        const tournament = await prismaClient.tournament.findUnique({
            where: {
                id: tournament_id
            }, include: {
                clients_tournament: true
            }
        })

        return (tournament)
    }
}

export { ExitClientTournamentService }