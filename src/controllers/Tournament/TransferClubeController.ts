import { Request, Response } from "express";
import { TransferClubeService } from "../../services/Transaction/TransferClubeService";

class TransferClubeController {
  async handle(req: Request, res: Response) {
    const { value, type, name, typeOut, observation } = req.body;

    let club_id = req.club_id;

    const transferClubeService = new TransferClubeService();

    const transaction = await transferClubeService.execute({
      type,
      value,
      typeOut,
      club_id,
      observation,
    });

    return res.json(transaction);
  }
}

export { TransferClubeController };
