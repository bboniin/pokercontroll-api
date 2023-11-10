import prismaClient from '../../prisma'

interface CategoryRequest {
    club_id: string;
}

class ListCategoriesService {
    async execute({ club_id }: CategoryRequest) {

        const categories = await prismaClient.category.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (categories)
    }
}

export { ListCategoriesService }