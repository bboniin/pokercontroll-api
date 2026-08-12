import { addMinutes } from "date-fns";
import prismaClient from "../../prisma";

interface TournamentRequest {
  name?: string;
  intervals?: string;
  blinds?: string;
  club_id: string;
  nivel_max_in?: number;
  nivel_max_timechip?: number;
  seconds_ajusted?: number;
  tournament_id: string;
  target_tournament_id?: string;
}

class EditTournamentService {} // placeholder if needed

class StructureTournamentService {
  async execute({
    club_id,
    name,
    intervals,
    nivel_max_in,
    nivel_max_timechip,
    seconds_ajusted,
    blinds,
    tournament_id,
    target_tournament_id,
  }: TournamentRequest) {
    if (!tournament_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const tournament = await prismaClient.tournament.findFirst({
      where: {
        id: tournament_id,
        club_id: club_id,
      },
    });

    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }

    const dataToUpdate: any = {};

    if (name !== undefined) {
      dataToUpdate.name = name;
    }

    if (blinds !== undefined) {
      dataToUpdate.blinds = blinds;
    }

    if (intervals !== undefined) {
      dataToUpdate.intervals = intervals;
    }

    if (nivel_max_in !== undefined) {
      dataToUpdate.max_in = nivel_max_in;
    }

    if (nivel_max_timechip !== undefined) {
      dataToUpdate.max_timechip = nivel_max_timechip;
    }

    if (seconds_ajusted !== undefined) {
      dataToUpdate.seconds_ajusted = seconds_ajusted;
    }

    if (target_tournament_id !== undefined) {
      dataToUpdate.classified_tournament_id = target_tournament_id;
    }

    const finalIntervals = intervals !== undefined ? intervals : tournament.intervals;
    const finalNivelMaxIn = nivel_max_in !== undefined ? nivel_max_in : tournament.max_in;
    const finalNivelMaxTimechip = nivel_max_timechip !== undefined ? nivel_max_timechip : tournament.max_timechip;

    if (finalIntervals) {
      let minsTimechip = 0;
      let minsIn = 0;

      finalIntervals.split("-").map((item, index) => {
        if (index < finalNivelMaxIn) {
          minsIn += parseInt(item.substring(1)) || 0;
        }
        if (index < finalNivelMaxTimechip) {
          minsTimechip += parseInt(item.substring(1)) || 0;
        }
      });

      dataToUpdate.datetime_max_in = addMinutes(
        new Date(tournament.datetime_initial),
        minsIn
      );
      dataToUpdate.datetime_max_timechip = addMinutes(
        new Date(tournament.datetime_initial),
        minsTimechip
      );
    }

    const tournamentEdit = await prismaClient.tournament.update({
      where: {
        id: tournament_id,
      },
      data: dataToUpdate,
    });

    return tournamentEdit;
  }
}

export { StructureTournamentService };
