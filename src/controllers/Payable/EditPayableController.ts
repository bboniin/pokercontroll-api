import { Request, Response } from "express";
import { EditPayableService } from "../../services/Payable/EditPayableService";

class EditPayableController {
  async handle(req: Request, res: Response) {
    const { payable_id } = req.params;
    const {
      name,
      observation,
      installmentsPaid,
      active,
      value,
      installments,
      account,
      period,
      recurrence,
      value_estimated,
      date_charge,
    } = req.body;

    let club_id = req.club_id;

    const editPayableService = new EditPayableService();

    const payable = await editPayableService.execute({
      name,
      observation,
      value,
      installments,
      account,
      period,
      club_id,
      payable_id,
      installmentsPaid,
      active,
      value_estimated,
      recurrence,
      date_charge,
    });

    return res.json(payable);
  }
}

export { EditPayableController };
