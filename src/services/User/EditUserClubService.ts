import { hash } from 'bcryptjs';
import prismaClient from '../../prisma'

interface UserRequest {
    name: string;
    email: string;
    type: string;
    password: string;
    user_id: string;
    club_id: string;
}

class EditUserClubService {
    async execute({ name, email, club_id, type, password, user_id }: UserRequest) {

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id,
                club_id: club_id
            }
        })

        if (!user) {
            throw new Error("Usuário não encontrado")
        }

        const emailVerify = await prismaClient.user.findUnique({
            where: {
                id: email
            }
        })

        if (!email || !name || !type) {
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
            type: type
        }

        if (password) {
            data["password"] = await hash(password, 8)
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

export { EditUserClubService }