import { differenceInSeconds } from 'date-fns';
import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    tournament_id: string;
}

class PausedTournamentService {
    async execute({ club_id, tournament_id }: TournamentRequest) {

        if (!tournament_id || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const tournament = await prismaClient.tournament.findFirst({
            where: {
                id: tournament_id,
                club_id: club_id,
            }
        })

        if (!tournament) {
            throw new Error("Produto não encontrado")
        }

        if (tournament.paused) {
            const tournamentEdit = await prismaClient.tournament.update({
                where: {
                    id: tournament_id,
                },
                data: {
                    paused: false,
                    seconds_paused: tournament.seconds_paused + differenceInSeconds(new Date(), new Date(tournament.time_paused))
                },
                include: {
                    clients_tournament: true,
                }
            })
            return (tournamentEdit)
        } else {
            const tournamentEdit = await prismaClient.tournament.update({
                where: {
                    id: tournament_id,
                },
                data: {
                    paused: true,
                    time_paused: new Date()
                },
                include: {
                    clients_tournament: true,
                }
            })
            return (tournamentEdit)
        }

    }
}

export { PausedTournamentService }