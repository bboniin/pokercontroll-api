import { Request, Response } from 'express';
import { CreateTournamentService } from '../../services/Tournament/CreateTournamentService';

class CreateTournamentController {
    async handle(req: Request, res: Response) {
        const { name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, addOn_value,
            addOn_token, timechip, chairs, totalAward_guaranteed, timer_round, timer_interval, rounds_to_interval, max_rebuy, rake
        } = req.body

        let club_id = req.club_id

        const blinds = "100/100-100/200-100/300-200/400-300/600-400/800-500/1000-600/1200-800/1600-1200/2400-1500/3000-2000/4000-2500/5000-3000/6000-4000/8000-5000/10000-6000/12000-7000/14000-8000/16000-10000/20000-12000/25000-15000/30000-20000/4000-25000/50000-30000/60000-40000/80000-50000/100000-60000/120000-80000/160000-100000/200000-120000/240000-150000/30000-200000/400000-250000/500000-300000/600000"
        const blindsArray = blinds.split("-")
        
        let intervals = ""
        let i = 1;
        let iT = 1;
        while(iT <= blindsArray.length){
            if (i % (rounds_to_interval+1) == 0) {
                intervals += "I" + timer_interval + "-"
            } else {
                intervals += "N" + timer_round + "-"
                iT++
            }
            i++
        }

        intervals = intervals.slice(0, -1);

        const createTournamentService = new CreateTournamentService

        const tournament = await createTournamentService.execute({
            name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, addOn_value,
            addOn_token, timechip, chairs, totalAward_guaranteed, intervals, club_id, max_rebuy, rake
        })

        return res.json(tournament)
    }
}

export { CreateTournamentController }