import prismaClient from '../../prisma'

interface CategoryRequest {
    category_id: string;
    club_id: string;
}

class DeleteCategoryService {
    async execute({ category_id, club_id }: CategoryRequest) {

        const category = await prismaClient.category.delete({
            where: {
                id: category_id,
            }
        })
        return (category)
    }
}

export { DeleteCategoryService }