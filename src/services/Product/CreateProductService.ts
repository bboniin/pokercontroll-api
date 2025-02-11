import prismaClient from '../../prisma'
import S3Storage from '../../utils/S3Storage';

interface ProductRequest {
    name: string;
    photo: string;
    value: number;
    club_id: string;
    category_id: string;
    cost_value: number;
}

class CreateProductService {
    async execute({ name, club_id, cost_value, category_id, value, photo }: ProductRequest) {

        if (!value || !name || !category_id || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        let data = {
            name: name,
            value: value,
            amount: 0,
            category_id: category_id,
            cost_value: cost_value,
            club_id: club_id,
        }

        if (photo) {
            const s3Storage = new S3Storage()

            const upload = await s3Storage.saveFile(photo)

            data["photo"] = upload
        }

        const product = await prismaClient.product.create({
            data: data
        })

        return (product)
    }
}

export { CreateProductService }