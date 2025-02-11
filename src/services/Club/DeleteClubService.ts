import prismaClient from '../../prisma'

interface ClubRequest {
    club_id: string;
    user_id: string;
}

class DeleteClubService {
    async execute({ club_id, user_id }: ClubRequest) {

        const club = await prismaClient.club.delete({
            where: {
                id: club_id,
            }
        })
        return (club)
    }
}

export { DeleteClubService }