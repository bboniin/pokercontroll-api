import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    client_id: string;
}

class ListTransactionsPendingService {
    async execute({ club_id, client_id }: TransactionRequest) {

        const transactions = await prismaClient.transaction.findMany({
            where: {
                club_id: club_id,
                client_id: client_id,
                paid: false,
                operation: "entrada"
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                methods_transaction: true,
                items_transaction: true
            }
        })     

        if (transactions.length == 0) {
            throw new Error("Nenhuma transação encontrada")
        }

        const total = transactions.reduce((acumulador, object) => {
            return acumulador + (object.value - object.value_paid);
        }, 0);

        return ({transactions, total})
    }
}

export { ListTransactionsPendingService }