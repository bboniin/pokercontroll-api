import { Request, Response } from 'express';
import { ClientsCashService } from '../../services/Cash/ClientsCashService';

class ClientsCashController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const clientsCashService = new ClientsCashService

        const clients = await clientsCashService.execute({
            club_id
        })

        clients.map((item) => {
            if (item["photo"]) {
                item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
            }
        })

        return res.json(clients)
    }
}

export { ClientsCashController }