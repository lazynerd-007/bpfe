import { Geist, Geist_Mono } from "next/font/google";
import type {Metadata} from "next"
import React from "react"
import {siteConfig} from "@/app/siteConfig"
import {ENV_VARIABLES} from "@/lib/constants";
import { Providers } from "@/providers";
import "@/app/styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
    metadataBase: new URL(ENV_VARIABLES.APP_URL),
    title: siteConfig.name,
    description: siteConfig.description,
    authors: [
        {
            name: "blupay africa",
            url: "",
        },
    ],
    creator: "blupay africa",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@blupayafrica",
    },
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
