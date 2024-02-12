import { Request, Response } from 'express';
import { EditUserClubService } from '../../services/User/EditUserClubService';

class EditUserClubController {
    async handle(req: Request, res: Response) {
        const { user_id } = req.params
        const { name, email, type, password } = req.body

        let club_id = req.club_id

        const editUserClubService = new EditUserClubService

        const user = await editUserClubService.execute({
            name, email, type, password, club_id, user_id
        })

        if (user["photo"]) {
            user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
        }

        return res.json(user)
    }
}

export { EditUserClubController }