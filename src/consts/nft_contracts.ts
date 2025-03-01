import type { Chain } from "thirdweb";
import { base, polygon } from "./chains";

export type NftContract = {
  id: string; // Added unique ID
  address: string;
  chain: Chain;
  chainId: number; // Added chainId for easier access
  type: "ERC1155" | "ERC721";
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

// Utility function to generate slugs
const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

export const NFT_CONTRACTS: NftContract[] = [
  {
    id: "pixel-world", // Example ID
    address: "0x7CbDae78ceb1E27Aa6B0588f58D68afa560f6E16",
    chain: base,
    chainId: base.id,
    title: "PIXEL WORLD by Mr.Brian Design",
    thumbnailUrl: "/thumb/PW-300.png",
    type: "ERC721",
    slug: generateSlug("PIXEL WORLD by Mr.Brian Design"), // Generate slug
  },
  {
    id: "little-world-glass", // Example ID
    address: "0xbA297ce86FFd76b9C5EA7EC47b2722B141f9b1Ea",
    chain: base,
    chainId: base.id,
    title: "LITTLE WORLD Glass Works",
    thumbnailUrl: "/thumb/GW-300.png",
    type: "ERC1155",
    slug: generateSlug("LITTLE WORLD Glass Works"), // Generate slug
  },
  {
    id: "little-world-pfps", // Example ID
    address: "0xdAd823bE6758f0584222A68E82C3e2621C4a952e",
    chain: base,
    chainId: base.id,
    title: "LITTLE WORLD PFPs",
    thumbnailUrl: "/thumb/LW-300.png",
    type: "ERC721",
    slug: generateSlug("LITTLE WORLD PFPs"), // Generate slug
  },
  {
    id: "machine-elves", // Example ID
    address: "0xDAFc541FDA44BDB0ca0861641B20f4e1B2784E27",
    chain: base,
    chainId: base.id,
    title: "MACHINE ELVES by ArtsAbide",
    thumbnailUrl: "/thumb/ME-300.png",
    type: "ERC721",
    slug: generateSlug("MACHINE ELVES by ArtsAbide"), // Generate slug
  },
  {
    id: "nyan-dot-cat", // Example ID
    address: "0xE7D4DE14e1e5bBC50BE8b0905a056beC56BE7B66",
    chain: base,
    chainId: base.id,
    title: "NYAN DOT CAT",
    thumbnailUrl: "/thumb/NyanDot.png",
    type: "ERC1155",
    slug: generateSlug("NYAN DOT CAT"), // Generate slug
  },
  {
    id: "phast-phood-phunks", // Example ID
    address: "0xAa7588F883377fd75EFbC814E266d121AAC3f398",
    chain: base,
    chainId: base.id,
    title: "Phast Phood Phunks by HAPS",
    thumbnailUrl: "/thumb/PPP.png",
    type: "ERC721",
    slug: generateSlug("Phast Phood Phunks by HAPS"), // Generate slug
  },
  {
    id: "based-nouns", // Example ID
    address: "0xBf57D0535E10E7033447174404b9bEd3D9eF4C88",
    chain: base,
    chainId: base.id,
    title: "Based Nouns",
    thumbnailUrl: "/thumb/BasedNouns.png",
    type: "ERC721",
    slug: generateSlug("Based Nouns"), // Generate slug
  },
   
];
