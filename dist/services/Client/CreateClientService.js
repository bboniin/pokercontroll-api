"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateClientService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateClientService {
  async execute({
    name,
    club_id,
    cpf,
    address,
    birthday,
    phone_number,
    photo,
    observation,
    credit
  }) {
    if (!name || !club_id) {
      throw new Error("Nome é obrigatório");
    }
    let data = {
      name: name,
      cpf: cpf,
      address: address,
      club_id: club_id,
      birthday: birthday,
      observation: observation,
      credit: credit,
      debt: 0,
      receive: 0,
      phone_number: phone_number
    };
    if (photo) {
      const s3Storage = new _S3Storage.default();
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }
    const client = await _prisma.default.client.create({
      data: data
    });
    return client;
  }
}
exports.CreateClientService = CreateClientService;