import prismaClient from '../../prisma'

interface ProductRequest {
    items: Array<[]>;
}

class VerifyProductService {
    async execute({ items }: ProductRequest) {

        if (!items) {
            throw new Error("Nenhum produto foi adicionado")
        }

        let error = ""

        items.map(async (data) => {
            const itemOrder = await prismaClient.product.findFirst({
                where: {
                    id: data["id"],
                    amount: {
                        gte: data["amount"]
                    }

                }
            })
            if (!itemOrder && !error) {
                error = `Produto \"${data["name"]}\" não tem estoque suficiente`
            }
        })  


        if (error) {
            throw new Error(error)
        }
       
        return true
    }
}

export { VerifyProductService }