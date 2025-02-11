import prismaClient from '../../prisma'

interface ClubRequest {
    user_id: string;
    page: number;
    all: boolean;
}

class ListClubsService {
    async execute({ user_id, page, all }: ClubRequest) {

        let filter = {}

        if (!all) {
            filter = {
                skip: page * 30,
                take: 30,
            }
        }

        const clubsTotal = await prismaClient.club.count()

        const clubs = await prismaClient.club.findMany({
            ...filter,
            skip: page * 30,
            take: 30,
            orderBy: {
                create_at: "asc"
            }
        })

        return all ? clubs  : ({clubs, clubsTotal})
    }
}

export { ListClubsService }