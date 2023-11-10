import prismaClient from '../../prisma'

interface CategoryRequest {
    name: string;
    club_id: string;
}

class CreateCategoryService {
    async execute({ name, club_id }: CategoryRequest) {

        if (!name || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const category = await prismaClient.category.create({
            data: {
                name: name,
                club_id: club_id
            }
        })

        return (category)
    }
}

export { CreateCategoryService }