import prismaClient from '../../prisma'

interface StockRequest {
    amount: number;
    cost_value: number;
    product_id: string;
    club_id: string;
    supplier_id: string;
}

class CreateStockService {
    async execute({ amount, product_id, cost_value, club_id, supplier_id }: StockRequest) {

        if (!amount || !product_id || !club_id || !supplier_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const product = await prismaClient.product.findFirst({
            where: {
                id: product_id,
                club_id: club_id
            }
        })

        if (!product) {
            throw new Error("Produto não encontrado")
        }

        await prismaClient.product.update({
            where: {
                id: product_id,
            },
            data: {
                amount: product.amount + amount
            }
        })
        
        const stock = await prismaClient.stock.create({
            data: {
                name: product.name,
                amount: amount,
                club_id: club_id, 
                cost_value: cost_value,
                supplier_id: supplier_id
            }
        })

        return (stock)
    }
}

export { CreateStockService }