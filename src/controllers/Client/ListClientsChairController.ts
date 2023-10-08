import { Request, Response } from 'express';
import { ListClientsChairService } from '../../services/Client/ListClientsChairService';

class ListClientsChairController {
    async handle(req: Request, res: Response) {

        const { tournament_id } = req.query

        let club_id = req.club_id

        const listClientsChairService = new ListClientsChairService

        const clients = await listClientsChairService.execute({
            club_id, tournament_id: tournament_id ? String(tournament_id) : ""
        })

        clients.map((item) => {
            if (item["photo"]) {
                item["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + item["photo"];
            }
        })

        return res.json(clients)
    }
}

export { ListClientsChairController }