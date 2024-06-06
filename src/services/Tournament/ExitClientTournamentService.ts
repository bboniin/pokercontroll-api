import prismaClient from '../../prisma'

interface TournamentRequest {
    client_id: string;
    position: number;
    tournament_id: string;
}

class ExitClientTournamentService {
    async execute({ client_id, tournament_id, position }: TournamentRequest) {

        if (!client_id || !tournament_id ) {
            throw new Error("Id do cliente e do torneio são obrigatórios")
        }

        const tournamentGet = await prismaClient.tournament.findUnique({
            where: {
                id: tournament_id,
            }, include: {
                clients_tournament: true
            }
        })

        if (!tournamentGet) {
            throw new Error("Torneio não foi encontrado")
        }


        const chairClient = await prismaClient.clientTournament.findFirst({
            where: {
                client_id: client_id,
                tournament_id: tournament_id,
                chair_tournament: {
                    contains: "T"
                }
            }
        })

        if (!chairClient) {
            throw new Error("Cliente não foi encontrado")
        }

        const chairClientPosition = await prismaClient.clientTournament.findFirst({
            where: {
                tournament_id: tournament_id,
                position: position
            }
        })

        if (chairClientPosition) {
            throw new Error("Outro jogador já foi eliminado nessa posição")
        }

        const award = position ? parseFloat(tournamentGet.award.split("-")[position-1]) : 0

        await prismaClient.clientTournament.update({
            where: {
                id: chairClient.id,
            },
            data: {
                date_out: new Date(),
                exit: true,
                position: position || 9999,
                award: award || 0,
                chair_tournament: ""
            }
        })

        const tournament = await prismaClient.tournament.findUnique({
            where: {
                id: tournament_id
            }, include: {
                clients_tournament: true
            }
        })

        return ({tournament, award: award})
    }
}

export { ExitClientTournamentService }