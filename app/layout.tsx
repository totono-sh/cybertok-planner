import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberTok Planner",
  description: "Planificador simple de videos diarios de ciberseguridad"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
