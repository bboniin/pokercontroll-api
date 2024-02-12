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
    client_id: string;
}

class EditClientService {
    async execute({ name, club_id, cpf, address, phone_number, photo, observation, credit, client_id }: ClientRequest) {

        if (!name || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id,
                visible: true
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrado")
        }

        let data = {
            name: name,
            cpf: cpf,
            address: address,
            observation: observation,
            credit: credit,
            balance: 0,
            phone_number: phone_number,
        }

        if (photo) {
            const s3Storage = new S3Storage()

            const upload = await s3Storage.saveFile(photo)

            data["photo"] = upload
        }

        const clientEdit = await prismaClient.client.update({
            where: {
                id: client_id,
            },
            data: data,
        })

        return (clientEdit)
    }
}

export { EditClientService }