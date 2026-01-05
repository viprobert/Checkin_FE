import { Box, Badge, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";

export default function ImageThumbStack({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const safe = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  if (safe.length === 0) return null;

  const main = safe[0];
  const extra = safe.length - 1;

  return (
    <>
      <Badge
        badgeContent={extra > 0 ? `+${extra}` : 0}
        color="primary"
        overlap="circular"
        invisible={extra <= 0}
        sx={{ cursor: "pointer", width: "fit-content" }}
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
      >
        <Box
          component="img"
          src={main}
          alt="thumb"
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            objectFit: "cover",
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      </Badge>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1, bgcolor: "black", position: "relative" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 2 }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={safe[index]}
            alt="preview"
            sx={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />

          {/* if multiple, allow click thumbnails */}
          {safe.length > 1 && (
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", p: 1 }}>
              {safe.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setIndex(i)}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    objectFit: "cover",
                    border: i === index ? "2px solid white" : "1px solid rgba(255,255,255,0.4)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
