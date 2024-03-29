import { Request, Response } from 'express';
import { ClientsTournamentService } from '../../services/Tournament/ClientsTournamentService';

class ClientsTournamentController {
    async handle(req: Request, res: Response) {
        
        const { tournament_id } = req.params
        let club_id = req.club_id

        const clientsTournamentService = new ClientsTournamentService

        const clients = await clientsTournamentService.execute({
            club_id, tournament_id
        })

        clients.map((item) => {
            if (item["photo"]) {
                item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
            }
        })

        return res.json(clients)
    }
}

export { ClientsTournamentController }