import { Chip } from "@mui/material";
import { type RoundStatus } from "../../types/admin.types";

const map: Record<RoundStatus, { label: string; color?: "success" | "warning" | "error" | "default" }> = {
  success: { label: "✅ ปกติ", color: "success" },
  pending: { label: "⏳ รอส่ง", color: "default" },
  late: { label: "⚠️ สาย", color: "warning" },
  absent: { label: "❌ ขาด", color: "error" },
  none: { label: "-", color: "default" },
};

export default function StatusChip({ status }: { status: RoundStatus }) {
  const m = map[status];
  return <Chip label={m.label} color={m.color} variant={m.color === "default" ? "outlined" : "filled"} size="small" />;
}
