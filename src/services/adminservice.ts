import { api } from "./api";
import { type LatestResponse, type CurrentRoundResponse } from "../types/admin.types";

export async function getLatest(shiftId: string) {
  const res = await api.get<LatestResponse>("/admin/latest", {
    params: { shiftId },
  });
  return res.data;
}

export async function getCurrentRound() {
  const res = await api.get<CurrentRoundResponse>("/admin");
  return res.data;
}

