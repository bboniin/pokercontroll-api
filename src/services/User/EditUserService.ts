import { hash } from 'bcryptjs';
import prismaClient from '../../prisma'
import S3Storage from '../../utils/S3Storage';

interface UserRequest {
    name: string;
    email: string;
    phone_number: string;
    photo: string;
    password: string;
    user_id: string;
}

class EditUserService {
    async execute({ name, email, phone_number, photo, password, user_id }: UserRequest) {

        const user = await prismaClient.user.findUnique({
            where: {
                id: user_id
            }
        })

        const emailVerify = await prismaClient.user.findUnique({
            where: {
                id: email
            }
        })

        if (!email || !name || !phone_number) {
            throw new Error("Preencha todos os campos obrigatórios")
        }

        if (emailVerify) {
            if (emailVerify.id != user.id) {
                throw new Error("Email já está sendo usado")
            }
        }

        let data = {
            name: name,
            email: email,
            phone_number: phone_number
        }

        if (password) {
            data["password"] = await hash(password, 8)
        }

        if (photo) {
            const s3Storage = new S3Storage()

            if (user["photo"]) {
                await s3Storage.deleteFile(user["photo"])
            }
            const upload = await s3Storage.saveFile(photo)

            data["photo"] = upload
        }


        const userRes = await prismaClient.user.update({
            where: {
                id: user_id
            },
            data: data
        })

        return (userRes)

    }
}

export { EditUserService }