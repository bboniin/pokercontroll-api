import prismaClient from '../../prisma'

interface ProductRequest {
    id: string;
    club_id: string;
}

class GetProductService {
    async execute({ id, club_id }: ProductRequest) {

        if (!id || !club_id) {
            throw new Error("Envie o id do produto e do clube")
        }

        const product = await prismaClient.product.findFirst({
                where: {
                    id: id,
                    club_id: club_id
                }
            })
       
        return product
    }
}

export { GetProductService }