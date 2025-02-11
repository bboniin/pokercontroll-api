import { Request, Response } from 'express';
import { DeleteUserClubService } from '../../services/User/DeleteUserClubService';

class DeleteUserClubController {
    async handle(req: Request, res: Response) {

        const { user_id } = req.params

        const deleteUserClubService = new DeleteUserClubService

        const user = await deleteUserClubService.execute({
            user_id
        })

        if (user["photo"]) {
            user["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
        }

        return res.json(user)
    }
}

export { DeleteUserClubController }