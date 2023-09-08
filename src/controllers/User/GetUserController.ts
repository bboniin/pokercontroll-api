import { Request, Response } from 'express';
import { GetUserService } from '../../services/User/GetUserService';

class GetUserController {
    async handle(req: Request, res: Response) {

        let user_id = req.user_id

        const getUserService = new GetUserService

        const user = await getUserService.execute({
            user_id
        })

        if (user["photo"]) {
            user["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + user["photo"];
        }

        return res.json(user)
    }
}

export { GetUserController }