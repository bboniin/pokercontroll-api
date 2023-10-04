import prismaClient from '../../prisma'

interface TournamentRequest {
    name: string;
    buyin_value: number;
    buyin_token: number;
    rebuy_value: number;
    rebuy_token: number;
    rebuyDuplo_value: number;
    rebuyDuplo_token: number;
    addOn_value: number;
    addOn_token: number;
    timechip: number;
    chairs: number;
    totalAward_guaranteed: number;
    timer_round: number;
    timer_interval: number;
    rounds_to_interval: number;
    club_id: string;
}

class CreateTournamentService {
    async execute({ name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, addOn_value,
        addOn_token, timechip, chairs, totalAward_guaranteed, timer_round, timer_interval, rounds_to_interval, club_id }: TournamentRequest) {

        console.log(name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, addOn_value,
            addOn_token, timechip, chairs, totalAward_guaranteed, timer_round, timer_interval, rounds_to_interval, club_id)
        
        if (!name || !buyin_value || !buyin_token || !rebuy_value ||
            !rebuy_token || !rebuyDuplo_value || !rebuyDuplo_token ||
            !addOn_value || !addOn_token || !timechip || !chairs ||
            !totalAward_guaranteed || !timer_round || !timer_interval ||
            !rounds_to_interval || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

     
        const tournament = await prismaClient.tournament.create({
            data: {
                name: name,
                buyin_value: buyin_value,
                buyin_token: buyin_token,
                rebuy_value: rebuy_value,
                rebuy_token: rebuy_token,
                rebuyDuplo_value: rebuyDuplo_value,
                rebuyDuplo_token: rebuyDuplo_token,
                addOn_value: addOn_value,
                addOn_token: addOn_token,
                timechip: timechip,
                chairs: chairs,
                totalAward_guaranteed: totalAward_guaranteed,
                club_id: club_id,
                total_tokens: 0,
                totalAward_accumulated: 0,
                blinds: "100/100-100/200-100/300-200/400-300/600-400/800-500/1000-600/1200-800/1600-1200/2400-1500/3000-2000/4000-2500/5000-3000/6000-4000/8000-5000/10000-6000/12000-7000/14000-8000/16000-10000/20000-12000/25000-15000/30000-20000/4000-25000/50000-30000/60000-40000/80000-50000/100000-60000/120000-80000/160000-100000/200000-120000/240000-150000/30000-200000/400000-250000/500000-300000/600000",
                intervals: "N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15-I30-N15-N15-N15-N15-N15-N15",
            }
        })

        return (tournament)
    }
}

export { CreateTournamentService }