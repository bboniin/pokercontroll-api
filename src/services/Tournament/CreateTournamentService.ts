import prismaClient from '../../prisma'

interface TournamentRequest {
    name: string;
    buyin_value: number;
    buyin_token: number;
    rebuy_value: number;
    rebuy_token: number;
    rebuyDuplo_value: number;
    rebuyDuplo_token: number;
    rebuyTriplo_value: number;
    rebuyTriplo_token: number;
    addOn_value: number;
    addOn_token: number;
    super_addOn_value: number;
    super_addOn_token: number;
    buyin_value_staff: number;
    buyin_token_staff: number;
    rebuy_value_staff: number;
    rebuy_token_staff: number;
    rebuyDuplo_value_staff: number;
    rebuyDuplo_token_staff: number;
    rebuyTriplo_value_staff: number;
    rebuyTriplo_token_staff: number;
    addOn_value_staff: number;
    addOn_token_staff: number;
    super_addOn_value_staff: number;
    super_addOn_token_staff: number;
    timechip: number;
    chairs: number;
    totalAward_guaranteed: number;
    intervals: string;
    club_id: string;
    max_rebuy: number;
    rake: number;
    passport: number;
    jackpot: number;
    dealer: number;
    nivel_max_buyin_discount: number;
    buyin_discount: number;
    nivel_max_in: number;
    nivel_max_timechip: number;
    percentage_players_award: number;
    is_rebuy: boolean;
    enable_rebuy: boolean;
    enable_rebuyDuplo: boolean;
    enable_rebuyTriplo: boolean;
    enable_addOn: boolean;
    enable_super_addOn: boolean;
    enable_buyin_staff: boolean;
    enable_rebuy_staff: boolean;
    enable_rebuyDuplo_staff: boolean;
    enable_rebuyTriplo_staff: boolean;
    enable_addOn_staff: boolean;
    enable_super_addOn_staff: boolean;
    show_max: boolean;
}

class CreateTournamentService {
    async execute({ name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, rebuyTriplo_value, rebuyTriplo_token,
        addOn_value, addOn_token, timechip, chairs, buyin_discount, totalAward_guaranteed, intervals, max_rebuy, rake, enable_super_addOn, 
        super_addOn_value, super_addOn_token, passport, jackpot, dealer, nivel_max_buyin_discount, nivel_max_in,
        nivel_max_timechip, percentage_players_award, show_max, is_rebuy, club_id, enable_rebuy, enable_rebuyDuplo, enable_rebuyTriplo, enable_addOn,
        enable_buyin_staff, enable_rebuy_staff, enable_rebuyDuplo_staff, enable_rebuyTriplo_staff, enable_addOn_staff, enable_super_addOn_staff, 
        buyin_value_staff, buyin_token_staff, rebuy_value_staff, rebuy_token_staff, rebuyDuplo_value_staff, rebuyDuplo_token_staff, rebuyTriplo_value_staff, rebuyTriplo_token_staff,
        addOn_value_staff, addOn_token_staff, super_addOn_value_staff, super_addOn_token_staff
    }: TournamentRequest) {
        
        if (!name || !buyin_value || !buyin_token || (enable_buyin_staff ? !buyin_value_staff ||
            !buyin_token_staff : false) || (enable_rebuy ? !rebuy_value ||
                !rebuy_token : false) || (enable_rebuy_staff ? !rebuy_value_staff || !rebuy_token_staff : false)
            || (enable_rebuyDuplo ? !rebuyDuplo_value || !rebuyDuplo_token : false) ||
            (enable_rebuyDuplo_staff ? !rebuyDuplo_value_staff || !rebuyDuplo_token_staff : false)
            || (enable_rebuyTriplo ? !rebuyTriplo_value || !rebuyTriplo_token : false) ||
            (enable_rebuyTriplo_staff ? !rebuyTriplo_value_staff || !rebuyTriplo_token_staff : false) ||
            (enable_addOn ? !addOn_value || !addOn_token : false) || (enable_addOn_staff ? !addOn_value_staff ||
                !addOn_token_staff : false) || !timechip || !chairs || !totalAward_guaranteed ||
            !intervals || (!enable_rebuy && !enable_rebuyDuplo && !enable_rebuyTriplo ? false : !max_rebuy) || !rake ||
            ( enable_super_addOn ? !super_addOn_value || !super_addOn_token : false) || (enable_super_addOn_staff ? !super_addOn_value_staff ||
                !super_addOn_token_staff : false) || !passport || !jackpot || !dealer || !nivel_max_in || !percentage_players_award || !club_id
        ) {
            throw new Error("Preencha os campos obrigatórios")
        }
     
        const tournament = await prismaClient.tournament.create({
            data: {
                name: name,
                buyin_value: buyin_value,
                buyin_token: buyin_token,
                enable_buyin_staff: enable_buyin_staff,
                buyin_value_staff: enable_buyin_staff ? buyin_value_staff : 0,
                buyin_token_staff: enable_buyin_staff ? buyin_token_staff : 0,
                enable_rebuy: enable_rebuy,
                rebuy_value: enable_rebuy ? rebuy_value : 0,
                rebuy_token: enable_rebuy ? rebuy_token : 0,
                enable_rebuy_staff: enable_rebuy_staff,
                rebuy_value_staff: enable_rebuy_staff ? rebuy_value_staff : 0,
                rebuy_token_staff: enable_rebuy_staff ? rebuy_token_staff : 0,
                enable_rebuyDuplo: enable_rebuyDuplo,
                rebuyDuplo_value: enable_rebuyDuplo ? rebuyDuplo_value : 0,
                rebuyDuplo_token: enable_rebuyDuplo ? rebuyDuplo_token : 0,
                enable_rebuyDuplo_staff: enable_rebuyDuplo_staff,
                rebuyDuplo_value_staff: enable_rebuyDuplo_staff ? rebuyDuplo_value_staff : 0,
                rebuyDuplo_token_staff: enable_rebuyDuplo_staff ? rebuyDuplo_token_staff : 0,
                enable_rebuyTriplo: enable_rebuyTriplo,
                rebuyTriplo_value: enable_rebuyTriplo ? rebuyTriplo_value : 0,
                rebuyTriplo_token: enable_rebuyTriplo ? rebuyTriplo_token : 0,
                enable_rebuyTriplo_staff: enable_rebuyTriplo_staff,
                rebuyTriplo_value_staff: enable_rebuyTriplo_staff ? rebuyTriplo_value_staff : 0,
                rebuyTriplo_token_staff: enable_rebuyTriplo_staff ? rebuyTriplo_token_staff : 0,
                enable_addOn: enable_addOn,
                addOn_value: enable_addOn ? addOn_value : 0,
                addOn_token: enable_addOn ? addOn_token : 0,
                enable_addOn_staff: enable_addOn_staff,
                addOn_value_staff: enable_addOn_staff ? addOn_value_staff : 0,
                addOn_token_staff: enable_addOn_staff ? addOn_token_staff : 0,
                enable_super_addOn: enable_super_addOn,
                super_addOn_value: enable_super_addOn ? super_addOn_value : 0,
                super_addOn_token: enable_super_addOn ? super_addOn_token : 0,
                enable_super_addOn_staff: enable_super_addOn_staff,
                super_addOn_value_staff: enable_super_addOn_staff ? super_addOn_value_staff : 0,
                super_addOn_token_staff: enable_super_addOn_staff ? super_addOn_token_staff : 0,
                timechip: timechip,
                max_rebuy: enable_rebuy || enable_rebuyDuplo || enable_rebuyTriplo ?  max_rebuy : 0,
                rake: rake, 
                chairs: chairs,
                is_rebuy: is_rebuy,
                passport_value: passport,
                jackpot_value: jackpot,
                dealer_value: dealer,
                buyin_discount: buyin_discount,
                max_buyin_discount: nivel_max_buyin_discount,
                max_in: nivel_max_in,
                max_timechip: nivel_max_timechip,
                show_max: show_max,
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