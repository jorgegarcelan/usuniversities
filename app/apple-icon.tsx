import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#f2efe6", borderRadius: 36 }}>
      <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#ff6b3d", transform: "translateY(12px)" }} />
      <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#10241f" }} />
      <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#c9ff36", transform: "translateY(-12px)" }} />
    </div>,
    size,
  );
}
