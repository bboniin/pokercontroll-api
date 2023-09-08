import { Request, Response } from 'express';
import { GetClientService } from '../../services/Client/GetClientService';

class GetClientController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params

        let club_id = req.club_id

        const getClientService = new GetClientService

        const client = await getClientService.execute({
            club_id, client_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { GetClientController }