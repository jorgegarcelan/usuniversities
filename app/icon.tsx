import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#f2efe6", borderRadius: 12 }}>
      <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#ff6b3d", transform: "translateY(4px)" }} />
      <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#10241f" }} />
      <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#c9ff36", transform: "translateY(-4px)" }} />
    </div>,
    size,
  );
}
