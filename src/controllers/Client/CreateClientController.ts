import { Request, Response } from 'express';
import { CreateClientService } from '../../services/Client/CreateClientService';

class CreateClientController {
    async handle(req: Request, res: Response) {
        const { name, credit, cpf, address, phone_number, observation } = req.body

        let photo = ""

        if (req.file) {
            photo = req.file.filename
        }

        let club_id = req.club_id

        const createClientService = new CreateClientService

        const client = await createClientService.execute({
            name, credit: credit ? parseFloat(credit) : 0, cpf, address, phone_number, photo, club_id, observation
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { CreateClientController }