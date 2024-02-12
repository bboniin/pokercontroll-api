import { Request, Response } from 'express';
import { CreateClubService } from '../../services/Club/CreateClubService';

class CreateClubController {
    async handle(req: Request, res: Response) {
        const { name, username, email, password, auth} = req.body

        const createClubService = new CreateClubService

        const club = await createClubService.execute({
            name, username, email, password, auth
        })
        return res.json(club)
    }
}

export { CreateClubController }