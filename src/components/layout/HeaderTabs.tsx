import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "🔴 รอบล่าสุด", path: "/" },
  { label: "🟡 รอบก่อนหน้า", path: "/previous" },
  { label: "📝 สรุปรายวัน", path: "/daily" },
  { label: "🌴 ลางาน/หยุด", path: "/absence" },
];

function currentTabIndex(pathname: string) {
  const idx = tabs.findIndex(t => t.path === pathname);
  return idx >= 0 ? idx : 0;
}

export default function HeaderTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const value = currentTabIndex(location.pathname);

  return (
    <Box sx={{ p: 2, pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
        📊 ระบบตรวจสอบการส่งงาน
      </Typography>

      <Tabs
        value={value}
        onChange={(_, v) => navigate(tabs[v].path)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((t) => (
          <Tab key={t.path} label={t.label} />
        ))}
      </Tabs>
    </Box>
  );
}
