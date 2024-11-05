import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    page: number;
    filter: object;
}

class ListTransactionsService {
    async execute({ club_id, page, filter }: TransactionRequest) {

        
        if (!filter) {
            filter = {}
        }

        const transactionsTotal = await prismaClient.transaction.count({
            where: {
                ...filter,
                club_id: club_id,
            }
        })

        const transactionsTotalReceive = await prismaClient.transaction.findMany({
            where: {
                operation: "entrada",
                paid: false,
                club_id: club_id,
            }
        })

        const transactionsTotalDebt = await prismaClient.transaction.findMany({
            where: {
                operation: "saida",
                paid: false,
                club_id: club_id,
            }
        })

        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id,
            },
            include: {
                transactions: {
                    skip: page * 30,
                    take: 30,
                    where: {...filter},
                    orderBy: {
                        create_at: "desc"
                    },
                    include: {
                        methods_transaction: true,
                        items_transaction: true,
                        client: true,
                    }
                }
            }
        })

        club["transactionsTotal"] = transactionsTotal
        club["transactionsTotalReceive"] = transactionsTotalReceive.length ? transactionsTotalReceive.map((prod) => prod.value-prod.value_paid).reduce((total, preco) => total + preco) : 0
        club["transactionsTotalDebt"] =  transactionsTotalDebt.length ? transactionsTotalDebt.map((prod) => prod.value-prod.value_paid).reduce((total, preco) => total + preco) : 0

        return (club)
    }
}

export { ListTransactionsService }