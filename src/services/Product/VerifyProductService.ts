import prismaClient from '../../prisma'

interface ProductRequest {
    items: Array<[]>;
}

class VerifyProductService {
    async execute({ items }: ProductRequest) {

        if (!items) {
            throw new Error("Nenhum produto foi adicionado")
        }

        items.map(async (data) => {
            const itemOrder = await prismaClient.product.findFirst({
                where: {
                    id: data["id"],
                    amount: {
                        gte: data["amount"]
                    }

                }
            })
            if (!itemOrder) {
                throw new Error(`Produto \"${data["name"]}\" não tem estoque suficiente`)
            }
        })  
       
        return true
    }
}

export { VerifyProductService }