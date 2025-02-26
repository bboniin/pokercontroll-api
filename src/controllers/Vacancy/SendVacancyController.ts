import { Request, Response } from "express";
import { SendVacancyService } from "../../services/Vacancy/SendVacancyService";

class SendVacancyController {
  async handle(req: Request, res: Response) {
    const { vacancy_id } = req.params;
    const { client_id } = req.body;

    let club_id = req.club_id;

    const sendVacancyService = new SendVacancyService();

    const supplier = await sendVacancyService.execute({
      client_id,
      club_id,
      vacancy_id,
    });

    return res.json(supplier);
  }
}

export { SendVacancyController };
