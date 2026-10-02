import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stack = ["Python", "Django / Flask", "REST APIs", "PostgreSQL", "AWS", "AI / ML"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#07080b",
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(34,211,238,0.22), transparent 45%), radial-gradient(circle at 92% 10%, rgba(167,139,250,0.20), transparent 45%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 56px 56px, 56px 56px",
          color: "#eceef3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              border: "2px solid rgba(34,211,238,0.6)",
              backgroundColor: "#0c0e13",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {siteConfig.initials}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#9aa1b1" }}>{siteConfig.location}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 44, color: "#a5f3fc", letterSpacing: "-0.01em" }}>
            {siteConfig.role}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 28, color: "#9aa1b1" }}>
            {siteConfig.focusAreas.join("  ·  ")}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {stack.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                backgroundColor: "rgba(255,255,255,0.04)",
                fontSize: 22,
                color: "#c8cdd8",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
