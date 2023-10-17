import prismaClient from '../../prisma'

interface ProductRequest {
    items: Array<[]>;
    observation: string;
    value: number;
    club_id: string;
    client_id: string;
}

class CreateOrderService {
    async execute({ club_id, value, observation, client_id, items }: ProductRequest) {

        if (!value || !items || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const order = await prismaClient.order.create({
            data: {
                value: value,
                observation: observation,
                club_id: club_id,
                client_id: client_id,
            }, 
            include: {
                client: true
            }
        })

        order["items"] = [] 
        items.map(async (data) => {
            const itemOrder = await prismaClient.productOrder.create({
                data: {
                    amount: data["total"],
                    order_id: order.id,
                    name: data["name"],
                    value: data["value"],
                }
            })
            order["items"].push(itemOrder)
        })  
       
       return (order)
    }
}

export { CreateOrderService }