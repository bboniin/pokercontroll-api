import prismaClient from '../../prisma'

interface UserRequest {
    club_id: string;
}

class ListUsersClubService {
    async execute({ club_id }: UserRequest) {

        const users = await prismaClient.user.findMany({
            where: {
                club_id: club_id
            },
            select: {
                name: true,
                type: true,
                email: true,
                id: true,
                club_id: true
            }
        })

        return (users)
    }
}

export { ListUsersClubService }