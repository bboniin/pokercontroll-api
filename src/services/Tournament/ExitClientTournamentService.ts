import prismaClient from '../../prisma'

interface TournamentRequest {
    client_id: string;
    club_id: string;
    position: number;
    tournament_id: string;
    methods_transaction: Array<[]>;
}

class ExitClientTournamentService {
    async execute({ client_id, club_id, tournament_id, position, methods_transaction }: TournamentRequest) {

        if (!client_id || !tournament_id || !methods_transaction.length) {
            throw new Error("Id do cliente, do torneio e meios de pagamento é obrigatório")
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

        const chairClientPosition = await prismaClient.clientTournament.findFirst({
            where: {
                tournament_id: tournament_id,
                position: position
            }
        })

        if (chairClientPosition) {
            throw new Error("Outro jogador já foi eliminado nessa posição")
        }

        const client = await prismaClient.client.update({
            where: {
                id: client_id,
            },
            data: {
                chair: "",
            }
        })


        const award = position ? parseFloat(tournamentGet.award.split("-")[position-1]) : 0

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
                position: position || 9999,
                award: award || 0
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