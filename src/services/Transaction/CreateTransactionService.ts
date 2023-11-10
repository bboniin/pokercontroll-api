import prismaClient from '../../prisma'

interface Item {
    name?: string;
    value?: number;
    amount?: number;
}

interface TransactionRequest {
    paid: boolean;
    type: string;
    value: number;
    methods_transaction: Array<[]>;
    items_transaction: Array<Item> ;
    client_id: string;
    club_id: string;
    operation: string;
    observation: string;
    date_payment: Date;
}
const typesTransaction = {
    "clube": true,
    "jackpot": true,
    "passport": true,
    "dealer": true,
}

class CreateTransactionService {
    async execute({ type, value, club_id, paid, client_id, methods_transaction, items_transaction, operation, date_payment, observation }: TransactionRequest) {
        
        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id
            }
        })

        console.log(methods_transaction)
        
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

        if (!typesTransaction[type]) {
            throw new Error("Tipo de transação é inválido")
        }
        
        let valueMethods = value
        if (paid) {
            date_payment = new Date()
        
            if (value == methods_transaction.map((method) => method["value"]).reduce((total, value) => total + value)) {
                valueMethods = methods_transaction.map((method) => method["value"]*((100-method["percentage"])/100)).reduce((total, value) => total + value)
            }
        } 

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
                        balance: club.balance + valueMethods
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
                            balance: club.balance - valueMethods
                        }
                    })
                }
        }
        
        items_transaction.map(async (item) => {
            await prismaClient.itemsTransaction.create({
                data: {
                    name: item["name"],
                    value: item["value"],
                    amount: item["amount"],
                    transaction_id: transaction.id
                }
            })
        })

        if (paid) {
            methods_transaction.map(async (item) => {
                await prismaClient.methodsTransaction.create({
                    data: {
                        name: item["name"],
                        percentage: item["percentage"],
                        value: item["value"],
                        transaction_id: transaction.id
                    }
                })
            })
        }
        

        return transaction
        

    }
}

export { CreateTransactionService }