import { Request, Response } from 'express';
import { CreateClubService } from '../../services/Club/CreateClubService';

class CreateClubController {
    async handle(req: Request, res: Response) {
        const { name, username, email, password} = req.body

        let user_id = req.user_id

        const createClubService = new CreateClubService

        const club = await createClubService.execute({
            name, username, email, password, user_id
        })
        return res.json(club)
    }
}

export { CreateClubController }