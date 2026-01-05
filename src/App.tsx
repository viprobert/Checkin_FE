import { BrowserRouter, Routes, Route  } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HeaderTabs from "./components/layout/HeaderTabs";
import LatestPage from "./pages/LatestPage";
import { Box, Typography } from "@mui/material";

function Placeholder({ title }: { title: string }) {
  return (
    <Box sx={{ p: 1 }}>
      <Typography color="text.secondary">{title} (coming soon)</Typography>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout header={<HeaderTabs />}>
        <Routes>
          <Route path="/" element={<LatestPage />} />
          <Route path="/previous" element={<Placeholder title="รอบก่อนหน้า" />} />
          <Route path="/daily" element={<Placeholder title="สรุปรายวัน" />} />
          <Route path="/absence" element={<Placeholder title="ลางาน/หยุด" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
