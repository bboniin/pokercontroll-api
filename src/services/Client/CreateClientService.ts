import prismaClient from '../../prisma'
import S3Storage from '../../utils/S3Storage';

interface ClientRequest {
    name: string;
    photo: string;
    phone_number: string;
    observation: string;
    credit: number;
    club_id: string;
    cpf: string;
    address: string;
}

class CreateClientService {
    async execute({ name, club_id, cpf, address, phone_number, photo, observation, credit }: ClientRequest) {

        if (!name || !club_id) {
            throw new Error("Nome é obrigatório")
        }

        let data = {
            name: name,
            cpf: cpf,
            address: address,
            club_id: club_id,
            chair: "",
            observation: observation,
            credit: credit,
            debt: 0,
            receive: 0,
            phone_number: phone_number,
        }

        if (photo) {
            const s3Storage = new S3Storage()

            const upload = await s3Storage.saveFile(photo)

            data["photo"] = upload
        }

        const client = await prismaClient.client.create({
            data: data
        })

        return (client)
    }
}

export { CreateClientService }