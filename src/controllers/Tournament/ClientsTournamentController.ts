import { Request, Response } from 'express';
import { ClientsTournamentService } from '../../services/Tournament/ClientsTournamentService';

class ClientsTournamentController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const clientsTournamentService = new ClientsTournamentService

        const clients = await clientsTournamentService.execute({
            club_id
        })

        clients.map((item) => {
            if (item["photo"]) {
                item["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + item["photo"];
            }
        })

        return res.json(clients)
    }
}

export { ClientsTournamentController }