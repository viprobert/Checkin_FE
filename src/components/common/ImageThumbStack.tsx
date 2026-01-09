import {
  Box,
  Badge,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import { getCheckinImages } from "../../services/adminservice";

const fullCache = new Map<string, string[]>();

type Props = {
  images: string[];              // thumbs from API
  checkinId?: string | null;     // used to fetch full images
};

export default function ImageThumbStack({ images, checkinId }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loadingFull, setLoadingFull] = useState(false);
  const [fullImages, setFullImages] = useState<string[] | null>(null);

  const thumbs = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  if (thumbs.length === 0) return null;

  const main = thumbs[0];
  const extra = thumbs.length - 1;

  // what to show in dialog: prefer full images; fallback to thumbs
  const viewImages = fullImages && fullImages.length ? fullImages : thumbs;
  const current = viewImages[index] || viewImages[0];

  const openDialog = async () => {
    setIndex(0);
    setOpen(true);

    // no checkinId -> can’t fetch full, show thumbs only
    if (!checkinId) return;

    // already loaded
    if (fullImages?.length) return;

    // cached
    const cached = fullCache.get(checkinId);
    if (cached?.length) {
      setFullImages(cached);
      return;
    }

    // fetch full images now
    try {
      setLoadingFull(true);
      const res = await getCheckinImages(checkinId);
      const imgs = Array.isArray(res?.images) ? res.images.filter(Boolean) : [];
      fullCache.set(checkinId, imgs);
      setFullImages(imgs);
    } catch {
      setFullImages(null);
    } finally {
      setLoadingFull(false);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setIndex(0);
  };

  return (
    <>
      <Badge
        badgeContent={extra > 0 ? `+${extra}` : 0}
        color="primary"
        overlap="circular"
        invisible={extra <= 0}
        sx={{ cursor: "pointer", width: "fit-content" }}
        onClick={openDialog}
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

      <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1, bgcolor: "black", position: "relative" }}>
          <IconButton
            onClick={closeDialog}
            sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 2 }}
          >
            <CloseIcon />
          </IconButton>

          {loadingFull ? (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 280 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <Box
                component="img"
                src={current}
                alt="preview"
                sx={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />

              {viewImages.length > 1 && (
                <Box sx={{ display: "flex", gap: 1, overflowX: "auto", p: 1 }}>
                  {viewImages.map((img, i) => (
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
