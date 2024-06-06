import { addMinutes } from 'date-fns';
import prismaClient from '../../prisma'

interface TournamentRequest {
    club_id: string;
    tournament_id: string;
}

class InitialTournamentService {
    async execute({ tournament_id, club_id}: TournamentRequest) {

        const tournament = await prismaClient.tournament.findFirst({
            where: {
                club_id: club_id,
                id: tournament_id
            }
        })

        if (!tournament) {
            throw new Error("Torneio não encontrado")
        }

        let minsTimechip = 0
        let minsIn = 0
        let minsBuyinDiscount = 0

        tournament.intervals.split("-").map((item, index) => {
            if (index < tournament.max_buyin_discount) {
                minsBuyinDiscount += parseInt(item.substring(1)) 
            }
            if (index < tournament.max_in) {
                minsIn += parseInt(item.substring(1)) 
            }
            if (index < tournament.max_timechip) {
                minsTimechip += parseInt(item.substring(1)) 
            }
        })

        const tournamentC = await prismaClient.tournament.update({
            where: {
                id: tournament_id,
            },
            data: {
                status: "inscricao",
                datetime_initial: new Date(),
                datetime_max_in: addMinutes(new Date(), minsIn),
                datetime_max_buyin_discount: addMinutes(new Date(), minsBuyinDiscount),
                datetime_max_timechip: addMinutes(new Date(), minsTimechip),
            },
            include: {
                clients_tournament: true,
            }
        })

        return tournamentC
    }
}

export { InitialTournamentService }