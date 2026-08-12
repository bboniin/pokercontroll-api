"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditUserService = void 0;
var _bcryptjs = require("bcryptjs");
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditUserService {
  async execute({
    name,
    email,
    phone_number,
    photo,
    password,
    user_id
  }) {
    const user = await _prisma.default.user.findUnique({
      where: {
        id: user_id
      }
    });
    const emailVerify = await _prisma.default.user.findUnique({
      where: {
        id: email
      }
    });
    if (!email || !name || !phone_number) {
      throw new Error("Preencha todos os campos obrigatórios");
    }
    if (emailVerify) {
      if (emailVerify.id != user.id) {
        throw new Error("Email já está sendo usado");
      }
    }
    let data = {
      name: name,
      email: email,
      phone_number: phone_number
    };
    if (password) {
      data["password"] = await (0, _bcryptjs.hash)(password, 8);
    }
    if (photo) {
      const s3Storage = new _S3Storage.default();
      if (user["photo"]) {
        await s3Storage.deleteFile(user["photo"]);
      }
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }
    const userRes = await _prisma.default.user.update({
      where: {
        id: user_id
      },
      data: data
    });
    return userRes;
  }
}
exports.EditUserService = EditUserService;