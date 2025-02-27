import { Request, Response } from "express";
import { ListVacancysService } from "../../services/Vacancy/ListVacancysService";

class ListVacancyController {
  async handle(req: Request, res: Response) {
    let { page, all } = req.query;
    let club_id = req.club_id;

    const listVacancysService = new ListVacancysService();

    const { vacancys, vacancysTotal } = await listVacancysService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
    });

    return res.json({ vacancys, vacancysTotal });
  }
}

export { ListVacancyController };
