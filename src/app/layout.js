import "./globals.css";
import AppProviders from "@/context/app-context";
import { MayaTranslationNotice } from "@/components/ui";

export const metadata = {
  title: "Croquetón 2026 | Una croquetita por favor",
  description:
    "Engage dog lovers with a fun, single-page landing experience for Croquetón, an event to donate dog food, featuring a heartwarming story and easy donation options.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AppProviders>
          <MayaTranslationNotice />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
