import { Box, Paper } from "@mui/material";
import React from "react";
import bg from "../../assets/back_home.png";

export default function AppLayout({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 1.5, sm: 3 },
          backgroundColor: "rgba(0,0,0,0.0)", // set to 0.15 if you want darker
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "min(1100px, 100%)",
            height: "min(900px, calc(100vh - 48px))",
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgba(255,255,255,0.92)",
          }}
        >
          {header}

          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {children}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
