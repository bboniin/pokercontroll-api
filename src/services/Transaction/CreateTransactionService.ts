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
    valueReceive: number;
    valueDebit: number;
    date_payment: Date;
    sector_id: string;
}
const typesTransaction = {
    "clube": true,
    "jackpot": true,
    "passport": true,
    "dealer": true,
}

class CreateTransactionService {
    async execute({ type, sector_id, value, valueReceive, valueDebit, club_id, paid, client_id, methods_transaction, items_transaction, operation, date_payment, observation }: TransactionRequest) {
        
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

        if (!typesTransaction[type]) {
            throw new Error("Tipo de transação é inválido")
        }
        
        let methodsPay = methods_transaction.filter((item)=> item["id"] != "Crédito")
        
        let valuePaid = methodsPay.length ? methodsPay.map((method) => method["value"]).reduce((total, value) => total + value) : 0
        let valueMethods = methodsPay.length ? methodsPay.map((method) => method["value"]*((100-method["percentage"])/100)).reduce((total, value) => total + value) : 0
        
        if (paid) {
            date_payment = new Date()
        }

        let transaction = null

        if (operation == "entrada") {
            transaction = await prismaClient.transaction.create({
                data: {
                    type: type,
                    value: value,
                    client_id: client_id,
                    club_id: club_id,
                    sector_id: sector_id,
                    operation: operation,
                    date_payment: date_payment,
                    observation: observation,
                    paid: paid,
                    value_paid: valuePaid + valueReceive + valueDebit
                }
            })

            if (value) {
                await prismaClient.client.update({
                    where: {
                        id: client_id,
                    },
                    data: {
                        debt: client.debt + value - (valuePaid + valueReceive)
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
                    sector_id: sector_id,
                    operation: operation,
                    date_payment: date_payment,
                    observation: observation,
                    paid: paid,
                    value_paid: valuePaid + valueReceive + valueDebit
                }
             })
            
            if (value) {
                await prismaClient.client.update({
                    where: {
                        id: client_id,
                    },
                    data: {
                        receive: client.receive + value - (valuePaid + valueDebit)
                    }
                })

                await prismaClient.club.update({
                    where: {
                        id: club_id,
                    },
                    data: {
                        balance: club.balance - valuePaid - valueDebit
                    }
                })
            }
        }
        
        await items_transaction.map(async (item) => {
            await prismaClient.itemsTransaction.create({
                data: {
                    name: item["name"],
                    value: item["value"],
                    amount: item["amount"],
                    transaction_id: transaction.id
                }
            })
        })

        methods_transaction.map(async (item) => {
            if (item["id"] != "Crédito" && item["value"]) {
                if (item["id"] != "Pag Dívida" && item["id"] != "Saldo") {
                    const method = await prismaClient.method.findFirst({
                        where: {
                            id: item["id"]
                        },
                    })
                    let balance = operation == "entrada" ? method["balance"]+item["value"]*((100-item["percentage"])/100) : method["balance"]-item["value"]*((100-item["percentage"])/100)
                    await prismaClient.method.update({
                        where: {
                            id: item["id"],
                        },
                        data: {
                            balance: balance
                        }
                    })
                }
                await prismaClient.methodsTransaction.create({
                    data: {
                        name: item["name"],
                        percentage: item["percentage"],
                        value: item["value"],
                        transaction_id: transaction.id
                    }
                })
            }
        })

        return transaction
        

    }
}

export { CreateTransactionService }