import { Request, Response } from 'express';
import { CreateUserClubService } from '../../services/User/CreateUserClubService';

class CreateUserClubController {
    async handle(req: Request, res: Response) {
        const { name, email, type, password } = req.body

        let club_id = req.club_id

        const createUserClubService = new CreateUserClubService

        const user = await createUserClubService.execute({
            name: name, email: email, password: password, type: type, club_id: club_id
        })

        return res.json(user)
    }
}

export { CreateUserClubController }