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
  Button,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import StatusChip from "../components/common/StatusChip";
import ImageThumbStack from "../components/common/ImageThumbStack";
import { getDashboard } from "../services/adminservice";
import { type DashboardResponse, type RoundStatus, type DashRow  } from "../types/admin.types";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

const fmtNow = (d: Date) =>
  d.toLocaleString("th-TH", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });

const fmtHHmm = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
};
const fileDate = (d: Date) => d.toLocaleDateString("en-CA");

const remarkText = (
  remark: "dayoff" | "sick" | null,
  r1: RoundStatus,
  r2: RoundStatus
) => {
  if (remark === "dayoff") return "DAYOFF";
  if (remark === "sick") return "SICK";

  const s = [r1, r2];
  if (s.includes("absent")) return "ABSENT";
  if (s.includes("late")) return "LATE";
  if (r1 === "success" && r2 === "success") return "SUCCESS";
  return "-";
};

const exportExcel = (rows: DashRow[]) => {
  const today = fileDate(new Date());
  const filename = `${today}_checkin.xlsx`;

  const exportRows = rows.map((r) => ({
    name: r.name,
    website: r.websiteName || "-",
    round1_status: r.round1.status,
    round1_time: fmtHHmm(r.round1.checkinTime) || "-",
    round2_status: r.round2.status,
    round2_time: fmtHHmm(r.round2.checkinTime) || "-",
    remark: remarkText(r.remark, r.round1.status, r.round2.status),
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "checkin");

  XLSX.writeFile(wb, filename);
};

function getRemarkChip(
  remark: "dayoff" | "sick" | null,
  r1: RoundStatus,
  r2: RoundStatus
) {
  if (remark === "dayoff") return <Chip size="small" label="หยุด" color="warning" />;
  if (remark === "sick") return <Chip size="small" label="ป่วย" color="error" />;

  const s = [r1, r2];

  if (s.includes("absent")) return <Chip size="small" label="ขาดงาน" color="error" />;
  if (s.includes("late")) return <Chip size="small" label="สาย" color="warning" />;

  if (r1 === "success" && r2 === "success")
    return <Chip size="small" label="สำเร็จ" color="success" />;

  return <Typography variant="body2" color="text.secondary">-</Typography>;
}

export default function DashboardPage() {
  const [now, setNow] = useState(() => new Date());
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(async (sid?: string | null) => {
    setLoading(true);
    setErr(null);
    try {
      const d = (await getDashboard(sid || undefined)) as DashboardResponse;
      setData(d);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(selectedShiftId);
  }, [load, selectedShiftId]);

  const rows = data?.rows || [];

  if (loading && !data) return <CircularProgress />;
  if (err) return <Alert severity="error">{err}</Alert>;
  if (!data) return <Alert severity="info">ยังไม่มีข้อมูล</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* (1) Date Time + Download*/}
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
        <Typography sx={{ fontWeight: 800, flex: 1 }}>
            วันที่: {fmtNow(now)}
        </Typography>

        <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => exportExcel(rows)}
        >
            ส่งออกไฟล์ Excel
        </Button>
        </Stack>

      {/* (2) Shift chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
        <Chip
          label={`ทั้งหมด (${data.totalUsers})`}
          color={selectedShiftId ? "default" : "primary"}
          onClick={() => setSelectedShiftId(null)}
          clickable
        />

        {data.shifts.map((s) => (
          <Chip
            key={s.shiftId}
            label={`${s.shiftName} - ${s.userCount}`}
            color={selectedShiftId === s.shiftId ? "primary" : "default"}
            onClick={() => setSelectedShiftId(s.shiftId)}
            clickable
          />
        ))}
      </Stack>

      {/* (3) Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight={900}>ชื่อ</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>เว็บไซต์</Typography></TableCell>
              {/* <TableCell><Typography fontWeight={900}>กะ</Typography></TableCell> */}
              <TableCell><Typography fontWeight={900}>รอบ 1</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>รอบ 2</Typography></TableCell>
              <TableCell><Typography fontWeight={900}>หมายเหตุ</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.userId} hover>
                <TableCell sx={{ fontWeight: 900 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={r.profileUrl || undefined} sx={{ width: 28, height: 28, fontSize: 12 }}>
                      {r.name?.[0] || "?"}
                    </Avatar>

                    <Box>
                      <div>{r.name}</div>
                      <Typography variant="caption" color="text.secondary">
                        {r.shiftName}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                {/* <TableCell>{r.shiftName}</TableCell> */}
                <TableCell>{r.websiteName || "-"}</TableCell>

                <TableCell>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <StatusChip status={r.round1.status} />
                      <ImageThumbStack images={r.round1.images || []} />
                    </Stack>
                    {fmtHHmm(r.round1.checkinTime) ? (
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {fmtHHmm(r.round1.checkinTime)}
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>

                <TableCell>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      <StatusChip status={r.round2.status} />
                      <ImageThumbStack images={r.round2.images || []} />
                    </Stack>
                    {fmtHHmm(r.round2.checkinTime) ? (
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {fmtHHmm(r.round2.checkinTime)}
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>

                <TableCell>
                  {getRemarkChip(r.remark, r.round1.status, r.round2.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
