import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    client_id: string;
    value: number;
}

class PaymentDebtsService {
    async execute({ club_id, client_id, value}: TransactionRequest) {

        let valueTotal = value

        if (!club_id || !client_id || !value) {
            throw new Error("id cliente, clube e valor a ser pago são obrigatórios")
        }
        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrada")
        }

        if (client.debt < value) {
            throw new Error("Valor de pagamento da divida é maior que a divida do cliente")
        }

        const transactions = await prismaClient.transaction.findMany({
            where: {
                client_id: client_id,
                paid: false,
                operation: "entrada"
            },
            orderBy: {
                create_at: "asc"
            }
        })

        if (transactions.length == 0) {
            throw new Error("Nenhuma transação não encontrada")
        }

        let valueTransaction = []

        await transactions.map((item) => { 
            if (value) { 
                let valuePaid = item.value - item.value_paid
                if (valuePaid <= value) { 
                    valueTransaction.push(valuePaid)
                    value-=valuePaid
                } else {
                    valueTransaction.push(value)
                    value=0
                }
            } else {
                valueTransaction.push(0)
            }
        })

        await transactions.map(async (item, index) => {
            if (valueTransaction[index]) {
                let valuePaid = item.value - item.value_paid
                if (valuePaid == valueTransaction[index]) {
                    await prismaClient.transaction.update({
                        where: {
                            id: item.id
                        },
                        data: {
                            paid: true,
                            value_paid: item.value
                        }
                    })
                    await prismaClient.methodsTransaction.create({
                        data: {
                            name: "Saldo",
                            percentage: 0,
                            value: valueTransaction[index],
                            transaction_id: item.id
                        }
                    })
                } else {
                    await prismaClient.transaction.update({
                        where: {
                            id: item.id
                        },
                        data: {
                            value_paid: item.value_paid + valueTransaction[index]
                        }
                    })
                    await prismaClient.methodsTransaction.create({
                        data: {
                            name: "Saldo",
                            percentage: 0,
                            value: valueTransaction[index],
                            transaction_id: item.id
                        }
                    })
                }
            }
        })

        await prismaClient.client.update({
            where: {
                id: client_id
            }, 
            data: {
                debt: client.debt - valueTotal
            }
        })

        return ("Pagamentos realizados com sucesso")
     }
}

export { PaymentDebtsService }