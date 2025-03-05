import { Request, Response } from "express";
import { ListGroupVacancysService } from "../../services/Vacancy/ListGroupVacancysService";

class ListGroupVacancyController {
  async handle(req: Request, res: Response) {
    let club_id = req.club_id;

    const listGroupVacancysService = new ListGroupVacancysService();

    const vacancys = await listGroupVacancysService.execute({
      club_id,
    });

    return res.json(vacancys);
  }
}

export { ListGroupVacancyController };
