import prismaClient from '../../prisma'

interface ProductRequest {
    club_id: string;
    page: number;
    all: boolean;
}

class ListProductsService {
    async execute({ club_id, page, all }: ProductRequest) {
        
        let filter = {}

        if (!all) {
            filter = {
                skip: page * 30,
                take: 30,
            }
        }

        const productsTotal = await prismaClient.product.count({
            where: {
                club_id: club_id,
            },
        })

        const products = await prismaClient.product.findMany({
            ...filter,
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

        return ({products, productsTotal})
    }
}

export { ListProductsService }