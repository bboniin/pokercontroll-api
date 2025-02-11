import { hash } from 'bcryptjs';
import prismaClient from '../../prisma'

interface UserRequest {
    name: string;
    email: string;
    password: string;
    type: string;
    club_id: string;
}

class CreateUserClubService {
    async execute({ name, email, password, type, club_id}: UserRequest) {

        if (!email || !name || !type || !password) {
            throw new Error("Preencha todos os campos obrigatórios")
        }

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (userAlreadyExists) {
            throw new Error("Email já cadastrado")
        }
        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                type: type,
                club_id: club_id,
                password: passwordHash,
            },
            select: {
                name: true,
                email: true,
                type: true,
                photo: true
            }
        })

        return (user)
    }
}

export { CreateUserClubService }