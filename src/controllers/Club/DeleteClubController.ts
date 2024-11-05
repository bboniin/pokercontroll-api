import { Request, Response } from 'express';
import { DeleteClubService } from '../../services/Club/DeleteClubService';

class DeleteClubController {
    async handle(req: Request, res: Response) {

        const { club_id } = req.params

        let user_id = req.user_id

        const deleteClubService = new DeleteClubService

        const club = await deleteClubService.execute({
            user_id, club_id
        })

        return res.json(club)
    }
}

export { DeleteClubController }