"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditClientService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditClientService {
  async execute({
    name,
    club_id,
    cpf,
    address,
    birthday,
    phone_number,
    photo,
    observation,
    credit,
    client_id
  }) {
    if (!name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const client = await _prisma.default.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id,
        visible: true
      }
    });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    let data = {
      name: name,
      cpf: cpf,
      address: address,
      observation: observation,
      credit: credit,
      birthday: birthday,
      phone_number: phone_number
    };
    if (photo) {
      const s3Storage = new _S3Storage.default();
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }
    const clientEdit = await _prisma.default.client.update({
      where: {
        id: client_id
      },
      data: data
    });
    return clientEdit;
  }
}
exports.EditClientService = EditClientService;