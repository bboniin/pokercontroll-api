import prismaClient from '../../prisma'

interface ClubRequest {
    name: string;
    user_id: string;
    username: string;
    password: string;
    email: string;
}

class CreateClubService {
    async execute({ name, user_id, username, password, email }: ClubRequest) {

        
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

        await prismaClient.user.create({
            data: {
                name: name,
                type: "admin",
                email: email,
                password: password,
                club_id: club.id
            }
        })

        return (club)
    }
}

export { CreateClubService }