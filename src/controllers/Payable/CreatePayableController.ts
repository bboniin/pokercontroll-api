import { Request, Response } from "express";
import { CreatePayableService } from "../../services/Payable/CreatePayableService";

class CreatePayableController {
  async handle(req: Request, res: Response) {
    const {
      name,
      observation,
      value,
      recurrence,
      installments,
      account,
      period,
      date_charge,
      value_estimated,
    } = req.body;

    let club_id = req.club_id;

    const createPayableService = new CreatePayableService();

    const payable = await createPayableService.execute({
      name,
      observation,
      value,
      installments,
      account,
      period,
      recurrence,
      date_charge,
      value_estimated,
      club_id,
    });
    return res.json(payable);
  }
}

export { CreatePayableController };
