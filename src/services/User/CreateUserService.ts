import { hash } from 'bcryptjs';
import prismaClient from '../../prisma'
import S3Storage from '../../utils/S3Storage';

interface UserRequest {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    type: string;
    club_id: string;
}

class CreateUserService {
    async execute({ name, email, phone_number, password, type, club_id}: UserRequest) {

        if (!email || !name || !phone_number || !password) {
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
                phone_number: phone_number,
            },
            select: {
                name: true,
                email: true,
                phone_number: true,
                photo: true
            }
        })

        return (user)
    }
}

export { CreateUserService }