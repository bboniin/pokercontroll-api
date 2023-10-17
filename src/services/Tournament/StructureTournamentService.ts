import { addMinutes } from 'date-fns';
import prismaClient from '../../prisma'

interface TournamentRequest {
    intervals: string;
    blinds: string;
    club_id: string;
    nivel_max_buyin_free: number;
    nivel_max_in: number;
    nivel_max_timechip: number;
    tournament_id: string;
}

class StructureTournamentService {
    async execute({ club_id, intervals, nivel_max_buyin_free, nivel_max_in, nivel_max_timechip,  blinds, tournament_id }: TournamentRequest) {

        if (!tournament_id || !blinds || !intervals || !nivel_max_in || !nivel_max_timechip || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const tournament = await prismaClient.tournament.findFirst({
            where: {
                id: tournament_id,
                club_id: club_id,
            }
        })

        if (!tournament) {
            throw new Error("Torneio não encontrado")
        }

        if (!nivel_max_buyin_free) {
            nivel_max_buyin_free = 0
        }

        let minsTimechip = 0
        let minsIn = 0
        let minsBuyinFree = 0

        intervals.split("-").map((item, index) => {
            if (index < nivel_max_buyin_free) {
                minsBuyinFree += parseInt(item.substring(1)) 
            }
            if (index < nivel_max_in) {
                minsIn += parseInt(item.substring(1)) 
            }
            if (index < nivel_max_timechip) {
                minsTimechip += parseInt(item.substring(1)) 
            }
        })

        console.log(addMinutes(new Date(tournament.datetime_initial), minsBuyinFree))

        const tournamentEdit = await prismaClient.tournament.update({
            where: {
                id: tournament_id,
            },
            data: {
                blinds: blinds,
                intervals: intervals,
                max_buyin_free: nivel_max_buyin_free,
                max_in: nivel_max_in,
                max_timechip: nivel_max_timechip,
                datetime_max_in: addMinutes(new Date(tournament.datetime_initial), minsIn),
                datetime_max_buyin_free: addMinutes(new Date(tournament.datetime_initial), minsBuyinFree),
                datetime_max_timechip: addMinutes(new Date(tournament.datetime_initial), minsTimechip),
            }
        })

        return (tournamentEdit)
    }
}

export { StructureTournamentService }