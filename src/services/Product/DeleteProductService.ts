import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ProductRequest {
  product_id: string;
  club_id: string;
}

class DeleteProductService {
  async execute({ product_id, club_id }: ProductRequest) {
    const productGet = await prismaClient.product.findFirst({
      where: {
        id: product_id,
        club_id,
      },
    });

    if (!productGet) {
      throw new Error("Produto não encontrado");
    }

    const product = await prismaClient.product.delete({
      where: {
        id: product_id,
      },
    });

    if (product.photo) {
      const s3Storage = new S3Storage();

      await s3Storage.deleteFile(product.photo);
    }

    return product;
  }
}

export { DeleteProductService };
