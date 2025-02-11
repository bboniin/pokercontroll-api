import prismaClient from '../../prisma'

interface ProductRequest {
    items: Array<[]>;
}

class DiscoutProductService {
    async execute({ items }: ProductRequest) {

        if (!items) {
            throw new Error("Nenhum produto foi adicionado")
        }

        items.map(async (data) => {
            const product = await prismaClient.product.findFirst({
                where: {
                    id: data["id"],
                }
            })
            await prismaClient.product.update({
                where: {
                    id: data["id"],
                },
                data: {
                    amount: product.amount - data["total"]
                }
            })
        })  
       
        return true
    }
}

export { DiscoutProductService }