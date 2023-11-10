import prismaClient from '../../prisma'

interface ProductRequest {
    club_id: string;
}

class ListProductsService {
    async execute({ club_id }: ProductRequest) {

        const products = await prismaClient.product.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                category: true
            }
        })

        return (products)
    }
}

export { ListProductsService }