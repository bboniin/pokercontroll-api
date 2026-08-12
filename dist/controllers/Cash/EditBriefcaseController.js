"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditBriefcaseController = void 0;
var _EditBriefcaseService = require("../../services/Cash/EditBriefcaseService");
class EditBriefcaseController {
  async handle(req, res) {
    const {
      value
    } = req.body;
    const {
      id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const editBriefcaseService = new _EditBriefcaseService.EditBriefcaseService();
    const briefcase = await editBriefcaseService.execute({
      club_id,
      user_id,
      id,
      value
    });
    return res.json(briefcase);
  }
}
exports.EditBriefcaseController = EditBriefcaseController;