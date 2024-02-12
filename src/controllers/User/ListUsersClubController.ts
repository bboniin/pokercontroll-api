import { Request, Response } from 'express';
import { ListUsersClubService } from '../../services/User/ListUsersClubService';

class ListUsersClubController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listUsersClubService = new ListUsersClubService

        const user = await listUsersClubService.execute({
            club_id
        })

        if (user["photo"]) {
            user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
        }

        return res.json(user)
    }
}

export { ListUsersClubController }