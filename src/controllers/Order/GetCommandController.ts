import { Request, Response } from 'express';
import { GetCommandService } from '../../services/Order/GetCommandService';

class GetCommandController {
    async handle(req: Request, res: Response) {

        const { command_id } = req.params

        let club_id = req.club_id

        const getCommandService = new GetCommandService

        const command = await getCommandService.execute({
            club_id, command_id
        })

        if (command["client"]["photo"]) {
            command["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + command["client"]["photo"];
        }

        return res.json(command)
    }
}

export { GetCommandController }