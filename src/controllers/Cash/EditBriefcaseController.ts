import { Request, Response } from "express";
import { EditBriefcaseService } from "../../services/Cash/EditBriefcaseService";

class EditBriefcaseController {
  async handle(req: Request, res: Response) {
    const { value } = req.body;
    const { id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const editBriefcaseService = new EditBriefcaseService();

    const briefcase = await editBriefcaseService.execute({
      club_id,
      user_id,
      id,
      value,
    });

    return res.json(briefcase);
  }
}

export { EditBriefcaseController };
