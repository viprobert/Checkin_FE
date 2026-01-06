import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { setTelegramHook } from "../services/adminservice";

const URL = import.meta.env.VITE_API_BASE_URL || "https://db81786d6ae6.ngrok-free.app";
const HARDCODE_WEBHOOK_URL = `${URL}/admin/telegram/webhook`;

export default function TelegramHookPage() {
  const [botName, setBotName] = useState("");
  const [botToken, setBotToken] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return botName.trim() && botToken.trim() && webhookSecret.trim();
  }, [botName, botToken, webhookSecret]);

  const onSubmit = async () => {
    setLoading(true);
    setOkMsg(null);
    setErrMsg(null);

    try {
      const res = await setTelegramHook({
        botName: botName.trim(),
        botToken: botToken.trim(),
        webhookSecret: webhookSecret.trim(),
        webhookUrl: HARDCODE_WEBHOOK_URL,
      });

      setOkMsg(res?.message || "Webhook set successfully");
    } catch (e: any) {
      setErrMsg(e?.response?.data?.message || e?.message || "Failed to set webhook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Alert severity="info" sx={{ fontWeight: 800 }}>
        ตั้งค่า Telegram Webhook
      </Alert>

      {okMsg ? <Alert severity="success">{okMsg}</Alert> : null}
      {errMsg ? <Alert severity="error">{errMsg}</Alert> : null}

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Bot Name"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Bot Token"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            fullWidth
            type="password"
          />

          <TextField
            label="Webhook Secret"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            fullWidth
            type="password"
          />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Webhook URL (hardcoded):
            </Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {HARDCODE_WEBHOOK_URL}
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={!canSubmit || loading}
            >
              {loading ? "Saving..." : "Set Webhook"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
