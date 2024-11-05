import { Request, Response } from 'express';
import { ClosedCommandService } from '../../services/Order/ClosedCommandService';

class ClosedCommandController {
    async handle(req: Request, res: Response) {
        const { command_id } = req.params

        let club_id = req.club_id

        const closedCommandService = new ClosedCommandService

        const command = await closedCommandService.execute({
            club_id, command_id
        })

        return res.json(command)
    }
}

export { ClosedCommandController }