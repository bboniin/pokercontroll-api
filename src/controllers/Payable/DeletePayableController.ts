import { Request, Response } from "express";
import { DeletePayableService } from "../../services/Payable/DeletePayableService";

class DeletePayableController {
  async handle(req: Request, res: Response) {
    const { payable_id } = req.params;

    let club_id = req.club_id;

    const deletePayableService = new DeletePayableService();

    const payable = await deletePayableService.execute({
      club_id,
      payable_id,
    });

    return res.json(payable);
  }
}

export { DeletePayableController };
