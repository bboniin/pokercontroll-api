import prismaClient from '../../prisma'

interface TransactionRequest {
    id: string;
    club_id: string;
    order_id: string;
}

class OrderTransactionService {
    async execute({ id,  club_id, order_id}: TransactionRequest) {

        if (!club_id || !id || !order_id) {
            throw new Error("Id da cobrança e do clube é obrigatório")
        }

        const transactionV = await prismaClient.transaction.findFirst({
            where: {
                id: id,
            }
        })
        
        if (!transactionV) {
            throw new Error("Transação não encontrada")
        }

        const transaction = await prismaClient.transaction.update({
            where: {
              id: id  
            },
            data: {
                order_id: order_id
            }
        })

        return (transaction)
     }
}

export { OrderTransactionService }