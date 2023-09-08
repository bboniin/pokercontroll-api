import { Request, Response } from 'express';
import { CreateUserService } from '../../services/User/CreateUserService';

class CreateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, phone_number, password } = req.body

        const createUserService = new CreateUserService

        const user = await createUserService.execute({
            name: "Teste", email: "boninho7834@gmail.com", phone_number: "2123123123", password: "123", type: "admin", club_id: "58dfg4dsf-dsf2sf57-asdfgsd5"
        })

        return res.json(user)
    }
}

export { CreateUserController }