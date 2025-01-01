import type { Chain } from "thirdweb";
import { base, polygon } from "./chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

/**
 * Below is a list of all NFT contracts supported by your marketplace(s)
 * This is of course hard-coded for demo purpose
 *
 * In reality, the list should be dynamically fetched from your own data source
 */
export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0x7CbDae78ceb1E27Aa6B0588f58D68afa560f6E16",
    chain: base,
    title: "PIXEL WORLD by Mr.Brian Design",
    thumbnailUrl: "/thumb/PW-300.png",
    type: "ERC721",
  },
  {
    address: "0xbA297ce86FFd76b9C5EA7EC47b2722B141f9b1Ea",
    chain: base,
    title: "LITTLE WORLD Glass Works",
    thumbnailUrl: "/thumb/GW-300.png",
    type: "ERC721",
  },
  {
    address: "0xdAd823bE6758f0584222A68E82C3e2621C4a952e",
    chain: base,
    title: "LITTLE WORLD PFPs",
    thumbnailUrl: "/thumb/LW-300.png",
    type: "ERC721",
  },
  {
    address: "0xDAFc541FDA44BDB0ca0861641B20f4e1B2784E27",
    chain: base,
    title: "MACHINE ELVES by ArtsAbide",
    thumbnailUrl: "/thumb/ME-300.png",
    type: "ERC721",
  },
];
