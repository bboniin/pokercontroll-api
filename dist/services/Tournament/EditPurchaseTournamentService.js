"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditPurchaseTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditPurchaseTournamentService {
  async execute({
    purchase_id,
    name,
    cashier,
    value,
    max_limit,
    token,
    value_staff,
    type,
    token_staff,
    multiple,
    club_id,
    is_staff
  }) {
    if (!club_id || !purchase_id) {
      throw new Error("Envie o id do clube e da compra");
    }

    // Executa tudo sob uma transação Prisma interactiva para manter integridade
    return await _prisma.default.$transaction(async tx => {
      const purchase = await tx.purchase.findFirst({
        where: {
          id: purchase_id
        },
        include: {
          tournament: true
        }
      });
      if (!purchase) {
        throw new Error("Compra não encontrada");
      }
      if (purchase.tournament.club_id !== club_id) {
        throw new Error("Não autorizado");
      }
      if (!name || !cashier || type != "service" && !token || is_staff && !token_staff) {
        throw new Error("Preencha todos os campos obrigatórios");
      }
      const nameExists = await tx.purchase.findFirst({
        where: {
          name: name,
          tournament_id: purchase.tournament_id,
          id: {
            not: purchase_id
          }
        }
      });
      if (nameExists) {
        throw new Error("Compra já criada com esse nome");
      }

      // 1. Buscar todas as compras realizadas por jogadores vinculadas a esta opção de compra
      const clientPurchases = await tx.clientPurchase.findMany({
        where: {
          purchase_id: purchase_id
        }
      });
      let totalDifference = 0;
      const clientDifferences = new Map();

      // 2. Calcular diferenças de fichas e atualizar ClientPurchase
      for (const cp of clientPurchases) {
        let difference = 0;
        if (cp.type === "staff") {
          // Se o token for 0 (anteriormente não gravado), considera o purchase.token_staff antigo
          const oldTokenUnit = cp.token > 0 ? cp.token : purchase.token_staff || 0;
          difference = (token_staff - oldTokenUnit) * cp.amount;
          await tx.clientPurchase.update({
            where: {
              id: cp.id
            },
            data: {
              token: token_staff
            }
          });
        } else {
          // Se o token for 0, considera o purchase.token antigo
          const oldTokenUnit = cp.token > 0 ? cp.token : purchase.token || 0;
          difference = (token - oldTokenUnit) * cp.amount;
          await tx.clientPurchase.update({
            where: {
              id: cp.id
            },
            data: {
              token: token
            }
          });
        }
        totalDifference += difference;
        if (difference !== 0) {
          const clientTournamentId = cp.client_id;
          const currentDiff = clientDifferences.get(clientTournamentId) || 0;
          clientDifferences.set(clientTournamentId, currentDiff + difference);
        }
      }

      // 3. Atualizar o timechip de cada jogador participante (ClientTournament)
      for (const [clientTournamentId, diff] of clientDifferences.entries()) {
        const clientTournament = await tx.clientTournament.findUnique({
          where: {
            id: clientTournamentId
          }
        });
        if (clientTournament) {
          await tx.clientTournament.update({
            where: {
              id: clientTournamentId
            },
            data: {
              timechip: (clientTournament.timechip || 0) + diff
            }
          });
        }
      }

      // 4. Atualizar o total_tokens do Torneio
      if (totalDifference !== 0) {
        const tournament = await tx.tournament.findUnique({
          where: {
            id: purchase.tournament_id
          }
        });
        if (tournament) {
          await tx.tournament.update({
            where: {
              id: purchase.tournament_id
            },
            data: {
              total_tokens: (tournament.total_tokens || 0) + totalDifference
            }
          });
        }
      }

      // 5. Atualizar a opção de compra do torneio
      const updatedPurchase = await tx.purchase.update({
        where: {
          id: purchase_id
        },
        data: {
          name: name,
          cashier: cashier,
          value: value || 0,
          max_limit: max_limit || 0,
          token: token,
          type: type,
          value_staff: value_staff || 0,
          token_staff: token_staff || 0,
          multiple: multiple || false,
          is_staff: is_staff || false
        }
      });
      return updatedPurchase;
    });
  }
}
exports.EditPurchaseTournamentService = EditPurchaseTournamentService;