import prismaClient from '../../prisma'

interface CategoryRequest {
    name: string;
    club_id: string;
    category_id: string;
}

class EditCategoryService {
    async execute({ name, club_id, category_id }: CategoryRequest) {

        if (!category_id || !name || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const category = await prismaClient.category.findFirst({
            where: {
                id: category_id,
                club_id: club_id,
            }
        })

        if (!category) {
            throw new Error("Método de pagamento não encontrado")
        }


        const categoryEdit = await prismaClient.category.update({
            where: {
                id: category_id,
            },
            data: {
                name: name
            },
        })

        return (categoryEdit)
    }
}

export { EditCategoryService }