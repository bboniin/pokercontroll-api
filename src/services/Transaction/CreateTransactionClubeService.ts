import prismaClient from '../../prisma'


interface TransactionRequest {
    paid: boolean;
    type: string;
    value: number;
    methods_transaction: Array<[]>;
    items_transaction: object;
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

class CreateTransactionClubeService {
    async execute({ type, value, club_id, paid, methods_transaction, items_transaction, operation, date_payment, observation }: TransactionRequest) {
        
        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id
            }
        })

        if (!type || !operation) {
            throw new Error("Tipo, operação é obrigatório")
        }

        if (operation != "entrada" && operation != "saida") {
            throw new Error("Apenas entradas e saidas são aceitos")
        }

        if (!typesTransaction[type]) {
            throw new Error("Tipo de transação é inválido")
        }
        
        let methodsPay = methods_transaction.filter((item)=> item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo")

        let valuePaid = 0
        let valueMethods = methodsPay.length ? methodsPay.map((method) => method["value"]*((100-method["percentage"])/100)).reduce((total, value) => total + value) : 0
        if (paid) {
            date_payment = new Date()
        
            valuePaid = value
        } else {
            valuePaid = methodsPay.length ? methodsPay.map((method) => method["value"]).reduce((total, value) => total + value) : 0
        }

        let transaction = null

        let updateBalance = null

        let valueDebit = methods_transaction.filter((item) => item["id"] == "Pag Dívida" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Pag Dívida")[0]["value"] : 0
        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo").length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0]["value"] : 0
                
        if (type == "clube") {
            if (operation == "entrada") {
               updateBalance = {balance: club.balance + (valueMethods + valueReceive)} 
            } else {
               updateBalance = {balance: club.balance - (valueMethods - valueDebit)} 
            }
        }
        if (type == "passport") {
            if (operation == "entrada") {
               updateBalance = {passport: club.passport + (valueMethods + valueReceive)} 
            } else {
               updateBalance = {passport: club.passport - (valueMethods - valueDebit)} 
            }
        }
        if (type == "dealer") {
            if (operation == "entrada") {
               updateBalance = {dealer: club.dealer + (valueMethods + valueReceive)} 
            } else {
               updateBalance = {dealer: club.dealer - (valueMethods - valueDebit)} 
            }
        }
        if (type == "jackpot") {
            if (operation == "entrada") {
               updateBalance = {jackpot: club.jackpot + (valueMethods + valueReceive)} 
            } else {
               updateBalance = {jackpot: club.jackpot - (valueMethods - valueDebit)} 
            }
        }

        if (operation == "entrada") {
            transaction = await prismaClient.transaction.create({
                data: {
                    type: type,
                    value: value,
                    club_id: club_id,
                    operation: operation,
                    date_payment: date_payment,
                    observation: observation,
                    paid: paid,
                    value_paid: valuePaid
                }
            })
            if (value) {
                await prismaClient.club.update({
                    where: {
                        id: club_id,
                    },
                    data: updateBalance
                })
            }
        } else {
             transaction = await prismaClient.transaction.create({
                data: {
                    type: type,
                    value: value,
                    club_id: club_id,
                    operation: operation,
                    date_payment: date_payment,
                    observation: observation,
                    paid: paid,
                    value_paid: valuePaid
                }
            })
            if (value) {
                await prismaClient.club.update({
                    where: {
                        id: club_id,
                    },
                    data: updateBalance
                })
            }
        }
        
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
        
        await prismaClient.itemsTransaction.create({
            data: {
                name: items_transaction["name"],
                value: items_transaction["value"],
                amount: items_transaction["amount"],
                transaction_id: transaction.id
            }
        })

        return transaction
    }
}

export { CreateTransactionClubeService }