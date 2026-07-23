import { Request, Response } from "express";
import { OrderAdvertisingsService } from "../../services/Club/OrderAdvertisingsService";

class OrderAdvertisingsController {
  async handle(req: Request, res: Response) {
    const { advertisings } = req.body;

    const club_id = req.club_id;

    const orderAdvertisingsService = new OrderAdvertisingsService();

    const advertising = await orderAdvertisingsService.execute({
      club_id,
      advertisings,
    });

    return res.json(advertising);
  }
}

export { OrderAdvertisingsController };
