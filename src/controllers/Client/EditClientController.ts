import { Request, Response } from 'express';
import { EditClientService } from '../../services/Client/EditClientService';

class EditClientController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params
        const { name, credit, cpf, address, phone_number, observation } = req.body

        let photo = ""

        if (req.file) {
            photo = req.file.filename
        }

        let club_id = req.club_id

        const editClientService = new EditClientService

        const client = await editClientService.execute({
            name, credit: credit ? parseFloat(credit) : 0, cpf, address, phone_number, observation, photo, club_id, client_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { EditClientController }