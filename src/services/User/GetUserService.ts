import prismaClient from '../../prisma'

interface UserRequest {
    user_id: string;
}

class GetUserService {
    async execute({ user_id }: UserRequest) {

        const user = await prismaClient.user.findUnique({
            where: {
                id: user_id
            },
            select: {
                club: {
                    select: {
                        access_cash: true,
                        access_order: true,
                        access_report: true,
                        access_stock: true,
                        access_tournament: true,
                        access_users: true
                    }
                },
                photo: true,
                id: true,
                name: true,
                email: true,
                club_id: true,
                type: true
            }
        })

        user["photo_url"] = user.photo ? "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user.photo : ""

        return (user)
    }
}

export { GetUserService }