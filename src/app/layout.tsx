import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { AutoConnect } from "thirdweb/react";
import { client } from "@/consts/client";
import { metamaskWallet } from "thirdweb/wallets";

export const metadata: Metadata = {
  title: "PIXEL WORLD Marketplace",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: "100px" }}>
        <Providers>
          <AutoConnect 
            client={client}
            wallets={[metamaskWallet()]}
          />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
