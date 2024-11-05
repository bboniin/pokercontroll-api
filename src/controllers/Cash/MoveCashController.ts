import { Request, Response } from 'express';
import { MoveCashService } from '../../services/Cash/MoveCashService';

class MoveCashController {
    async handle(req: Request, res: Response) {
        const { id, chair, chair_initial } = req.body

        let club_id = req.club_id

        const moveCashService = new MoveCashService

        const client = await moveCashService.execute({
            chair, id, club_id, chair_initial
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { MoveCashController }