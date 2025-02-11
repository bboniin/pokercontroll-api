import prismaClient from '../../prisma'

interface ProductRequest {
    product_id: string;
    club_id: string;
}

class DeleteProductService {
    async execute({ product_id, club_id }: ProductRequest) {

        const product = await prismaClient.product.delete({
            where: {
                id: product_id,
            }
        })
        return (product)
    }
}

export { DeleteProductService }