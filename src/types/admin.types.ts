export type RoundStatus = "success" | "pending" | "late" | "absent" | "none";

export type LatestRow = {
  userId: string;
  name: string;
  shift: string;
  profileUrl: string | null;
  round1: { status: RoundStatus; images: string[] };
  round2: { status: RoundStatus; images: string[] };
};

export type LatestResponse = {
  ok: boolean;
  meta: {
    shiftId: string;
    shiftName: string;
    shiftTime: string;
    round: number | null;
    startAt: string | null;
    endAt10: string | null;
  };
  counts: { success: number; pending: number; late: number; absent: number };
  rows: LatestRow[];
};

export type CurrentRoundResponse = {
  ok: boolean;
  active: null | {
    shiftId: string;
    shiftName?: string | null;
    round?: number | null;
    createdAt?: string;
  };
};