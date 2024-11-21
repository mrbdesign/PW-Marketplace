"use client";

import { Token } from "@/components/token-page/TokenPage";
import { button } from "framer-motion/client";

export default function ListingPage({
  params,
}: {
  params: { tokenId: string };
}) {
  const { tokenId } = params;
  if (!tokenId) {
    throw new Error("Missing listingId");
  }
  return <Token tokenId={BigInt(tokenId)} />;
}

