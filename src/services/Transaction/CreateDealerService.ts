import prismaClient from '../../prisma'

interface TransactionRequest {
    paid: boolean;
    type: string;
    value: number;
    methods_transaction: object;
    items_transaction: object;
    client_id: string;
    club_id: string;
    operation: string;
    observation: string;
    date_payment: Date;
}

class CreateDealerService {
    async execute({ type, value, club_id, paid, client_id, methods_transaction, items_transaction, operation, date_payment, observation }: TransactionRequest) {
        
        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id
            }
        })
        
        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrado")
        }

        if (!type || !client_id || !operation) {
            throw new Error("Tipo, operação e id do cliente é obrigatório")
        }

        if (operation != "entrada" && operation != "saida") {
            throw new Error("Apenas entradas e saidas são aceitos")
        }

        if (type != "dealer") {
            throw new Error("Tipo de transação é inválido")
        }
        
        let valueMethods = value
        if (paid) {
            date_payment = new Date()
        
            
            if (value == methods_transaction["value"]) {
                valueMethods = methods_transaction["value"]*((100-methods_transaction["percentage"])/100)
            }
        } 
        
        console.log(valueMethods)

        let transaction = null

        if (operation == "entrada") {
            if (!paid) {
                if (((client.balance - value) * -1) > client.credit ) {
                    throw new Error("Crédito insuficiente para essa transação")
                } else {
                    transaction = await prismaClient.transaction.create({
                        data: {
                            type: type,
                            value: value,
                            client_id: client_id,
                            club_id: club_id,
                            operation: operation,
                            date_payment: date_payment,
                            observation: observation,
                            paid: paid
                        }
                    })

                    await prismaClient.client.update({
                        where: {
                            id: client_id,
                        },
                        data: {
                            balance: client.balance - value
                        }
                    })
                }
            } else {
                transaction = await prismaClient.transaction.create({
                    data: {
                        type: type,
                        value: value,
                        client_id: client_id,
                        club_id: club_id,
                        operation: operation,
                        date_payment: date_payment,
                        observation: observation,
                        paid: paid
                    }
                })

                await prismaClient.club.update({
                    where: {
                        id: club_id,
                    },
                    data: {
                        dealer: club.dealer + valueMethods
                    }
                })
            }
        } else {
            transaction = await prismaClient.transaction.create({
                data: {
                    type: type,
                    value: value,
                    client_id: client_id,
                    club_id: club_id,
                    operation: operation,
                    date_payment: date_payment,
                    observation: observation,
                    paid: paid
                }
            })
            if (paid) {
                    await prismaClient.club.update({
                        where: {
                            id: club_id,
                        },
                        data: {
                            dealer: club.dealer - valueMethods
                        }
                    })
                }
        }
        
        await prismaClient.itemsTransaction.create({
            data: {
                name: items_transaction["name"],
                value: items_transaction["value"],
                amount: items_transaction["amount"],
                transaction_id: transaction.id
            }
        })

        if (paid) {
            await prismaClient.methodsTransaction.create({
                data: {
                    name: methods_transaction["name"],
                    percentage: methods_transaction["percentage"],
                    value: methods_transaction["value"],
                    transaction_id: transaction.id
                }
            })
        }
        
        return transaction
    }
}

export { CreateDealerService }