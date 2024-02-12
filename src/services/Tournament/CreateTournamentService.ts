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
    intervals: string;
    club_id: string;
    max_rebuy: number;
    rake: number;
    super_addOn_value: number;
    super_addOn_token: number;
    passport: number;
    jackpot: number;
    dealer: number;
    nivel_max_buyin_free: number;
    nivel_max_in: number;
    nivel_max_timechip: number;
    percentage_players_award: number;
    is_rebuy: boolean;
    enable_rebuy: boolean;
    enable_rebuyDuplo: boolean;
    enable_addOn: boolean;
    enable_super_addOn: boolean;
    show_max: boolean;
}

class CreateTournamentService {
    async execute({ name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token,
        addOn_value, addOn_token, timechip, chairs, totalAward_guaranteed, intervals, max_rebuy, rake, enable_super_addOn, 
        super_addOn_value, super_addOn_token, passport, jackpot, dealer, nivel_max_buyin_free, nivel_max_in,
        nivel_max_timechip, percentage_players_award, show_max, is_rebuy, club_id, enable_rebuy, enable_rebuyDuplo, enable_addOn }: TournamentRequest) {
        
        if (!name || !buyin_value || !buyin_token || (enable_rebuy ? !rebuy_value ||
            !rebuy_token : false) || ( enable_rebuyDuplo ? !rebuyDuplo_value || !rebuyDuplo_token : false ) ||
            (enable_addOn ? !addOn_value || !addOn_token : false) || !timechip || !chairs || !totalAward_guaranteed ||
            !intervals || (!enable_rebuy && !rebuyDuplo_value ? false : !max_rebuy) || !rake ||
            ( enable_super_addOn ? !super_addOn_value || !super_addOn_token : false) || !passport ||
            !jackpot || !dealer || !nivel_max_in || !nivel_max_timechip || !percentage_players_award || !club_id
        ) {
            throw new Error("Preencha os campos obrigatórios")
        }
     
        const tournament = await prismaClient.tournament.create({
            data: {
                name: name,
                buyin_value: buyin_value,
                buyin_token: buyin_token,
                enable_rebuy: enable_rebuy,
                rebuy_value: enable_rebuy ? rebuy_value : 0,
                rebuy_token: enable_rebuy ? rebuy_token : 0,
                enable_rebuyDuplo: enable_rebuyDuplo,
                rebuyDuplo_value: enable_rebuyDuplo ? rebuyDuplo_value : 0,
                rebuyDuplo_token: enable_rebuyDuplo ? rebuyDuplo_token : 0,
                enable_addOn: enable_addOn,
                addOn_value: enable_addOn ? addOn_value : 0,
                addOn_token: enable_addOn ? addOn_token : 0,
                timechip: timechip,
                max_rebuy: enable_rebuy || enable_rebuyDuplo ?  max_rebuy : 0,
                rake: rake, 
                chairs: chairs,
                is_rebuy: is_rebuy,
                enable_super_addOn: enable_super_addOn,
                super_addOn_value: enable_super_addOn ? super_addOn_value : 0,
                super_addOn_token: enable_super_addOn ? super_addOn_token : 0,
                passport_value: passport,
                jackpot_value: jackpot,
                dealer_value: dealer,
                max_buyin_free: nivel_max_buyin_free,
                max_in: nivel_max_in,
                show_max: show_max,
                max_timechip: nivel_max_timechip,
                percentage_players_award: percentage_players_award,
                totalAward_guaranteed: totalAward_guaranteed,
                club_id: club_id,
                total_tokens: 0,
                totalAward_accumulated: 0,
                blinds: "100/100-100/200-100/300-200/400-300/600-400/800-500/1000-600/1200-800/1600-1200/2400-1500/3000-2000/4000-2500/5000-3000/6000-4000/8000-5000/10000-6000/12000-7000/14000-8000/16000-10000/20000-12000/25000-15000/30000-20000/4000-25000/50000-30000/60000-40000/80000-50000/100000-60000/120000-80000/160000-100000/200000-120000/240000-150000/30000-200000/400000-250000/500000-300000/600000",
                intervals: intervals
            }
        })

        return (tournament)
    }
}

export { CreateTournamentService }