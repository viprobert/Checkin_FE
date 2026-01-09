import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getAbsence } from "../services/adminservice";
import { type AbsenceType, type AbsenceResponse, type AbsenceDate } from "../types/admin.types";

function TypeChip({ type }: { type: AbsenceType }) {
  if (type === "sick") return <Chip size="small" label="ป่วย" color="warning" />;
  if (type === "personal") return <Chip size="small" label="กิจ" color="warning" />;
  return <Chip size="small" label="หยุด" color="success" />;
}

const fmtAbsenceDate = (d: AbsenceDate): string => {
  const date = new Date(d.y, d.m - 1, d.day);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function AbsencePage() {
  const [data, setData] = useState<AbsenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const d = (await getAbsence()) as AbsenceResponse;
      setData(d);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) return <CircularProgress />;
  if (err) return <Alert severity="error">{err}</Alert>;
  if (!data) return <Alert severity="info">ยังไม่มีข้อมูล</Alert>;

  if (!data.rows.length) {
    return <Alert severity="info">วันนี้ไม่มีคนลางาน/หยุด</Alert>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Alert severity="info" sx={{ fontWeight: 800 }}>
        ลางาน/หยุด • วันที่ {fmtAbsenceDate(data.date)}
      </Alert>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`หยุด: ${data.counts.dayoff}`} color="warning" />
        <Chip label={`ป่วย: ${data.counts.sick}`} color="error" />
        <Chip label={`กิจ: ${data.counts.personal}`} color="info" />
        <Chip label={`รวม: ${data.rows.length}`} variant="outlined" />
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight={900}>ชื่อ</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>เว็บไซต์</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>ประเภท</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.rows.map((r) => (
              <TableRow key={r.userId} hover>
                <TableCell sx={{ fontWeight: 900 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={r.profileUrl || undefined} sx={{ width: 28, height: 28, fontSize: 12 }}>
                      {r.name?.[0] || "?"}
                    </Avatar>
                    <span>{r.name}</span>
                  </Stack>
                </TableCell>

                <TableCell>{r.websiteName || "-"}</TableCell>

                <TableCell>
                  <TypeChip type={r.type} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
