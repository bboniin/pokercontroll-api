import { Request, Response } from "express";
import { TransferClubeService } from "../../services/Transaction/TransferClubeService";

class TransferClubeController {
  async handle(req: Request, res: Response) {
    const { value, type, name, typeOut, observation, methods_transaction } =
      req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const transferClubeService = new TransferClubeService();

    const transaction = await transferClubeService.execute({
      type,
      value,
      typeOut,
      club_id,
      observation,
      methods_transaction,
      user_id,
    });

    return res.json(transaction);
  }
}

export { TransferClubeController };
