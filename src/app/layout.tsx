import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Next match",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id || null;
  return (
    <html lang="en">
      <body>
        <TopNav />
        <Providers userId={userId}>
          <main className="container mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
