import { Request, Response } from 'express';
import { CreateTournamentService } from '../../services/Tournament/CreateTournamentService';

class CreateTournamentController {
    async handle(req: Request, res: Response) {
        const { name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, addOn_value
            , addOn_token, timechip, chairs, totalAward_guaranteed, timer_round, timer_interval, rounds_to_interval
        } = req.body

        let club_id = req.club_id

        const createTournamentService = new CreateTournamentService

        const tournament = await createTournamentService.execute({
            name, buyin_value, buyin_token, rebuy_value, rebuy_token, rebuyDuplo_value, rebuyDuplo_token, addOn_value,
            addOn_token, timechip, chairs, totalAward_guaranteed, timer_round, timer_interval, rounds_to_interval, club_id
        })

        return res.json(tournament)
    }
}

export { CreateTournamentController }