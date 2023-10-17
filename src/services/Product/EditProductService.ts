import prismaClient from '../../prisma'
import S3Storage from '../../utils/S3Storage';

interface ProductRequest {
    name: string;
    photo: string;
    value: number;
    club_id: string;
    amount: number;
    category: string;
    product_id: string;
}

class EditProductService {
    async execute({ name, club_id, value, category, photo, amount, product_id }: ProductRequest) {

        if (!product_id || !value || !name || !category || !amount || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const product = await prismaClient.product.findFirst({
            where: {
                id: product_id,
                club_id: club_id,
            }
        })

        if (!product) {
            throw new Error("Produto não encontrado")
        }

        let data = {
            name: name,
            value: value,
            category: category,
            amount: amount,
        }

        if (photo) {
            const s3Storage = new S3Storage()

            const upload = await s3Storage.saveFile(photo)

            data["photo"] = upload
        }

        const productEdit = await prismaClient.product.update({
            where: {
                id: product_id,
            },
            data: data,
        })

        return (productEdit)
    }
}

export { EditProductService }