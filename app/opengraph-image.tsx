import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Emakings AI — Make Every Connection More Meaningful.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#090b18",
        color: "white",
        padding: 90,
      }}
    >
      <div style={{ fontSize: 30, color: "#b69aff", marginBottom: 45 }}>
        ∞ emakings ai
      </div>
      <div style={{ fontSize: 76, lineHeight: 1.1, letterSpacing: -3 }}>
        Make Every Connection
      </div>
      <div
        style={{
          fontSize: 76,
          lineHeight: 1.1,
          color: "#b69aff",
          letterSpacing: -3,
        }}
      >
        More Meaningful.
      </div>
      <div style={{ fontSize: 25, color: "#aaaabe", marginTop: 40 }}>
        A little intelligence. A lot more connection.
      </div>
    </div>,
    size,
  );
}
