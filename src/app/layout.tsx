import type { Metadata } from "next";
import {
  Anton,
  JetBrains_Mono,
  Manrope,
  Noto_Sans_Ethiopic,
  Permanent_Marker,
} from "next/font/google";
import { BackgroundMusic } from "@/components/background-music";
import { IntroOverlay } from "@/components/intro-overlay";
import { EVENT, SITE_URL } from "@/lib/landing-content";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic", "latin"],
  weight: "variable",
  variable: "--font-noto-ethiopic",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-permanent-marker",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${EVENT.name} — ${EVENT.readableDate}`,
    template: `%s · ${EVENT.name}`,
  },
  description: EVENT.description,
  keywords: [
    "Ethiopian MMA",
    "Addis Ababa boxing",
    "Muay Thai Ethiopia",
    "Ethiopian fight card",
    "Adwa Fight Night",
    "ETFC 02",
    "Sedo Martial Art vs Johnny Jitsu",
    "Inspector Boyka vs Edris",
    "Biniyam vs Esubalew",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: "_lbqlP1hqgBK8XqR98_7jsSoXkdBdvesMLgrGHDJWPU",
  },
  openGraph: {
    title: `${EVENT.name} — ${EVENT.readableDate}`,
    description: EVENT.description,
    url: SITE_URL,
    siteName: EVENT.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/landing/L1.png", width: 1332, height: 758, alt: EVENT.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${EVENT.name} — ${EVENT.readableDate}`,
    description: EVENT.description,
    images: ["/landing/L1.png"],
  },
};

const THEME_INIT_SCRIPT = `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('theme-light')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${manrope.variable} ${jetbrainsMono.variable} ${notoSansEthiopic.variable} ${permanentMarker.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <IntroOverlay />
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
