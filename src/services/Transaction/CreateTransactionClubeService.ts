import prismaClient from '../../prisma'


interface TransactionRequest {
    paid: boolean;
    type: string;
    value: number;
    methods_transaction: object;
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
        
        if (paid) {
            date_payment = new Date()
        } 

        let updateBalance = null

        if (type == "clube") {
            if (operation == "entrada") {
               updateBalance = {balance: club.balance + value} 
            } else {
               updateBalance = {balance: club.balance - value} 
            }
        }
        if (type == "passport") {
            if (operation == "entrada") {
               updateBalance = {passport: club.passport + value} 
            } else {
               updateBalance = {passport: club.passport - value} 
            }
        }
        if (type == "dealer") {
            if (operation == "entrada") {
               updateBalance = {dealer: club.dealer + value} 
            } else {
               updateBalance = {dealer: club.dealer - value} 
            }
        }
        if (type == "jackpot") {
            if (operation == "entrada") {
               updateBalance = {jackpot: club.jackpot + value} 
            } else {
               updateBalance = {jackpot: club.jackpot - value} 
            }
        }

        let transaction = null

        if (operation == "entrada") {
            transaction = await prismaClient.transaction.create({
                data: {
                    type: type,
                    value: value,
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
                    paid: paid
                }
            })
            if (paid) {
                await prismaClient.club.update({
                    where: {
                        id: club_id,
                    },
                    data: updateBalance
                })
            }
        }
        
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
        
        let teste = await prismaClient.itemsTransaction.create({
            data: {
                name: items_transaction["name"],
                value: items_transaction["value"],
                amount: items_transaction["amount"],
                transaction_id: transaction.id
            }
        })

        console.log(teste, transaction.id)

        return transaction
    }
}

export { CreateTransactionClubeService }