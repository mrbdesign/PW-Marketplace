import type { Chain } from "thirdweb";
import { base } from "./chains";

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
    thumbnailUrl:
      "/thumb/PW-300.png",
    type: "ERC721",
  },
  
];
