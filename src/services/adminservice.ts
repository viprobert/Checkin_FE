import { api } from "./api";
import { type LatestResponse, type CurrentRoundResponse } from "../types/admin.types";

export async function getLatest(shiftId: string) {
  const res = await api.get<LatestResponse>("/admin/latest", {
    params: { shiftId },
  });
  return res.data;
}

export async function getCurrentRound() {
  const res = await api.get<CurrentRoundResponse>("/admin/round");
  return res.data;
}

export async function getPreviousRound() {
  return api.get("/admin/previous").then((r) => r.data);
}

export async function getAbsence() {
  return api.get("/admin/absence").then((r) => r.data);
}

export async function getDashboard(shiftId?: string) {
  const params = shiftId ? { shiftId } : undefined;
  return api.get("/admin/dashboard", { params }).then((r) => r.data);
}

export async function getDaily(shiftId?: string) {
  const params = shiftId ? { shiftId } : undefined;
  return api.get("/admin/daily", { params }).then((r) => r.data);
}

export async function setTelegramHook(body: {
  botToken: string;
  botName: string;
  webhookSecret: string;
  webhookUrl: string;
}) {
  return api.post("/hook", body).then((r) => r.data);
}
