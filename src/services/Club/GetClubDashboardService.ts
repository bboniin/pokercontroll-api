import prismaClient from "../../prisma";

interface DashboardRequest {
  club_id: string;
}

class GetClubDashboardService {
  async execute({ club_id }: DashboardRequest) {
    if (!club_id) {
      throw new Error("Clube ID é obrigatório");
    }

    // 1. Dados do Clube
    const club = await prismaClient.club.findUnique({
      where: { id: club_id },
      select: {
        id: true,
        name: true,
        photo: true,
        balance: true,
        passport: true,
        jackpot: true,
        dealer: true,
        primary_color: true,
        font_color: true,
        background_color: true,
        background_image: true,
        plan_name: true,
        expiration_plan: true,
        access_cash: true,
        access_tournament: true,
        access_stock: true,
        access_order: true,
        access_report: true,
        access_users: true,
        access_advertising: true,
        access_custom: true,
      },
    });

    if (!club) {
      throw new Error("Clube não encontrado");
    }

    const clubData: any = { ...club };
    if (clubData.photo) {
      clubData.photo_url =
        "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + clubData.photo;
    }
    if (clubData.background_image) {
      clubData.background_image_url =
        "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
        clubData.background_image;
    }

    // 2. Total de Clientes
    const totalClients = await prismaClient.client.count({
      where: { club_id, visible: true },
    });

    // 3. Caixa Operacional
    const financialBox = await prismaClient.financialBox.findFirst({
      where: { club_id, closed: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 4. Torneios Ativos (que não estão encerrados)
    const activeTournaments = await prismaClient.tournament.findMany({
      where: {
        club_id,
        status: {
          not: "encerrado",
        },
      },
      orderBy: {
        create_at: "desc",
      },
    });

    // 5. Sessões de Cash Ativas (abertas)
    const activeCashSessions = await prismaClient.cash.findMany({
      where: {
        club_id,
        closed: false,
      },
      orderBy: {
        create_at: "desc",
      },
    });

    // 6. Últimas 15 Transações
    const transactions = await prismaClient.transaction.findMany({
      where: { club_id },
      take: 15,
      orderBy: {
        create_at: "desc",
      },
      include: {
        methods_transaction: true,
        items_transaction: true,
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Enriquecer transações com o nome da sessão de cash ou do torneio, se sector_id estiver preenchido
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        let sector_name = null;
        if (transaction.sector_id) {
          // Tenta buscar no cash game primeiro
          const cash = await prismaClient.cash.findUnique({
            where: { id: transaction.sector_id },
            select: { name: true },
          });

          if (cash) {
            sector_name = cash.name;
          } else {
            // Tenta buscar no torneio
            const tournament = await prismaClient.tournament.findUnique({
              where: { id: transaction.sector_id },
              select: { name: true },
            });
            if (tournament) {
              sector_name = tournament.name;
            }
          }
        }
        return {
          ...transaction,
          sector_name,
        };
      })
    );

    return {
      club: clubData,
      totalClients,
      financialBox: financialBox
        ? {
            id: financialBox.id,
            closed: financialBox.closed,
            balance: financialBox.value_initial, // ou balance do caixa se houver? Vamos mapear compatível
            value_initial: financialBox.value_initial,
            date_initial: financialBox.date_initial,
            user: financialBox.user,
          }
        : null,
      activeTournaments,
      activeCashSessions,
      recentTransactions: enrichedTransactions,
    };
  }
}

export { GetClubDashboardService };
