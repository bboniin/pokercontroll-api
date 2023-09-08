import { Request, Response } from 'express';
import { ListClientsService } from '../../services/Client/ListClientsService';

class ListClientsController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listClientsService = new ListClientsService

        const clients = await listClientsService.execute({
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

export { ListClientsController }