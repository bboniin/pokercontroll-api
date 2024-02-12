import { Request, Response } from 'express';
import { ListCommandsService } from '../../services/Order/ListCommandsService';

class ListCommandsController {
    async handle(req: Request, res: Response) {

        let { page } = req.query
        let club_id = req.club_id

        const listCommandsService = new ListCommandsService

        const {commands, commandsTotal} = await listCommandsService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0
        })

        commands.map((command) => {
            if (command["client"]["photo"]) {
                command["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + command["client"]["photo"];
            }
        })

        return res.json({commands, commandsTotal})
    }
}

export { ListCommandsController }