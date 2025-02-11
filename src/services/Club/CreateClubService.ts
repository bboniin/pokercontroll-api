import { hash } from 'bcryptjs';
import prismaClient from '../../prisma'

interface ClubRequest {
    name: string;
    auth: string;
    username: string;
    password: string;
    email: string;
}

class CreateClubService {
    async execute({ name, auth, username, password, email }: ClubRequest) {

        if (auth != "vini7834poker") {
            throw new Error("Chave de acesso inválida")
        }
        
        if (!name || !username || !password || !email) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const clubGet = await prismaClient.club.findUnique({
            where: {
                username: username,
            }
        })

        if (clubGet) {
            throw new Error("Username já existente")
        }

        const userGet = await prismaClient.user.findUnique({
            where: {
                email: email,
            }
        })

        if (userGet) {
            throw new Error("Email já está em uso")
        }

        const club = await prismaClient.club.create({
            data: {
                username: username,
                name: name,
            }
        })

        await prismaClient.method.createMany({
            data: [{
                name: "Pix",
                percentage: 0,
                identifier: "pix",
                club_id: club.id,
                balance: 0
            },{
                name: "Dinheiro",
                percentage: 0,
                identifier: "dinheiro",
                club_id: club.id,
                balance: 0
            }]
        })

        const passwordHash = await hash(password, 8)

        await prismaClient.user.create({
            data: {
                name: name,
                type: "admin",
                email: email,
                password: passwordHash,
                club_id: club.id
            }
        })

        return (club)
    }
}

export { CreateClubService }