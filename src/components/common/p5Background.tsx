import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import p5 from "p5";

type Props = {
  bgImage: string;
  fgImage?: string;
  particleCount?: number;
};

export default function P5Background({
  bgImage,
  fgImage,
  particleCount = 500,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const sketch = (p: any) => {
      let bck: any = null;
      let ready = false;
      let particles: Particle[] = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.pixelDensity(1);

        // ✅ p5 v2: load assets in setup using callbacks
        p.loadImage(
          bgImage,
          (img: any) => {
            bck = img;
            ready = true;
          },
          (err: any) => {
            console.error("Failed to load bgImage:", bgImage, err);
            // still allow particles even if background fails
            ready = true;
          }
        );
      };

      p.draw = () => {
        // if image not loaded yet, just clear background
        if (bck) {
          p.image(bck, 0, 0, p.width, p.height);
        } else {
          p.background(34, 65, 84); // fallback
        }

        // don’t spawn until setup ran
        if (!ready) return;

        while (particles.length < particleCount) {
          particles.push(new Particle(p));
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const alive = particles[i].update();
          if (!alive) particles.splice(i, 1);
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      class Particle {
        x: number;
        y: number;
        r: number;
        a: number;
        vy: number;
        vx: number;

        constructor(p: any) {
          this.r = p.random(1, 8);
          this.a = p.random(90, 160);
          this.x = p.random(0, p.width);
          this.y = p.height + p.random(0, 80); // start from below
          this.vy = p.random(-3.2, -0.6);      // upward
          this.vx = p.random(-0.35, 0.35);
        }

        update() {
          p.noStroke();
          p.fill(102, 183, 255, this.a);
          p.ellipse(this.x, this.y, this.r, this.r);

          this.a -= p.random(0.2, 1);
          this.x += this.vx;
          this.y += this.vy;

          if (this.a <= 0) return false;
          if (this.y < -30) return false;
          if (this.x < -30 || this.x > p.width + 30) return false;
          return true;
        }
      }
    };

    const instance = new p5(sketch, hostRef.current);

    return () => {
      instance.remove();
    };
  }, [bgImage, particleCount]);

  return (
    <Box
      ref={hostRef}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,

        ...(fgImage
          ? {
              "&:after": {
                content: "''",
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${fgImage})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom center",
                backgroundSize: "100% auto",
                pointerEvents: "none",
                zIndex: 1,
              },
            }
          : {}),

        "& canvas": {
          position: "absolute",
          inset: 0,
          width: "100% !important",
          height: "100% !important",
          zIndex: 0,
        },
      }}
    />
  );
}
