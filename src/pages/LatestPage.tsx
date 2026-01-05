import {
  Alert,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import StatusChip from "../components/common/StatusChip";
import ImageThumbStack from "../components/common/ImageThumbStack";
import { getLatest, getCurrentRound } from "../services/adminservice";
import { type LatestResponse } from "../types/admin.types";
import { useAppState } from "../context/AppContext";
import { getSocket } from "../services/socket";

export default function LatestPage() {
  const { activeShiftId, setActiveShiftId } = useAppState();
  const [data, setData] = useState<LatestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeShiftId) return;
    setLoading(true);
    setErr(null);
    try {
      const d = await getLatest(activeShiftId);
      setData(d);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [activeShiftId]);

  useEffect(() => {
    if (!activeShiftId) {
      setLoading(false);
      setErr(null);
      setData(null);
      return;
    }
    load();
  }, [activeShiftId, load]);

  // Round Start
  useEffect(() => {
    const s = getSocket();
    const onConnect = () => s.emit("joinDashboards");
    const onRoundStarted = (payload: any) => {
      const shiftId = payload?.shiftId;
      if (!shiftId) return;

      setActiveShiftId(shiftId);
      s.emit("joinShift", shiftId);
    };

    s.on("connect", onConnect);
    s.on("roundStarted", onRoundStarted);

    if (s.connected) s.emit("joinDashboards");

    return () => {
      s.off("connect", onConnect);
      s.off("roundStarted", onRoundStarted);
    };
  }, [setActiveShiftId]);
  // Checkin
  useEffect(() => {
    const s = getSocket();

    const onCheckinUpdated = (payload: any) => {
      if (!activeShiftId) return;
      if (payload?.shiftId !== activeShiftId) return;

      load();
    };

    s.on("checkinUpdated", onCheckinUpdated);

    return () => {
      s.off("checkinUpdated", onCheckinUpdated);
    };
  }, [activeShiftId, load]);

  const resume = async () => {
    try {
      const cur = await getCurrentRound();
      const shiftId = cur?.active?.shiftId;
      if (shiftId) {
        setActiveShiftId(shiftId);
        const s = getSocket();
        s.emit("joinDashboards");
        s.emit("joinShift", shiftId);
      }
    } catch {
    }
  };

  //Resume
  useEffect(() => {
    resume();
  }, [activeShiftId, setActiveShiftId]);

  if (!activeShiftId) {
    resume();
    load();
  }

  if (loading && !data) return <CircularProgress />;
  if (err) return <Alert severity="error">{err}</Alert>;
  if (!data) return <Alert severity="info">ยังไม่มีข้อมูลรอบล่าสุด</Alert>;

  const timeText =
    data.meta.startAt
      ? new Date(data.meta.startAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
      : "-";

  const roundText = data.meta.round ? `รอบ ${data.meta.round}` : "ยังไม่มีรอบ";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Alert severity="info" sx={{ fontWeight: 800 }}>
        รอบล่าสุดเวลา: {timeText} ({data.meta.shiftName} {data.meta.shiftTime}) • {roundText}
      </Alert>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Success: ${data.counts.success}`} color="success" />
        <Chip label={`Pending: ${data.counts.pending}`} variant="outlined" />
        <Chip label={`Late: ${data.counts.late}`} color="warning" />
        <Chip label={`Absent: ${data.counts.absent}`} color="error" />
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight={900}>ชื่อ</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>กะ</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>รอบ 1</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>รอบ 2</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.rows.map((r) => (
              <TableRow key={r.userId} hover>
                <TableCell sx={{ fontWeight: 900 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={r.profileUrl || undefined}
                      sx={{ width: 28, height: 28, fontSize: 12 }}
                    >
                      {r.name?.[0] || "?"}
                    </Avatar>
                    <span>{r.name}</span>
                  </Stack>
                </TableCell>

                <TableCell>{r.shift}</TableCell>

                <TableCell>
                  <Stack spacing={0.75}>
                    <StatusChip status={r.round1.status} />
                    <ImageThumbStack images={r.round1.images || [] } /> 
                  </Stack>
                </TableCell>

                <TableCell>
                  <Stack spacing={0.75}>
                    <StatusChip status={r.round2.status} />
                    <ImageThumbStack images={r.round2.images || [] } />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
