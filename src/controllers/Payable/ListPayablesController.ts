import { Request, Response } from "express";
import { ListPayablesService } from "../../services/Payable/ListPayablesService";

class ListPayablesController {
  async handle(req: Request, res: Response) {
    let { page, all } = req.query;
    let club_id = req.club_id;

    const listPayablesService = new ListPayablesService();

    const payables = await listPayablesService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
    });

    return res.json(payables);
  }
}

export { ListPayablesController };
