import type { Chain } from "thirdweb";
import { base, polygon } from "./chains";

type MarketplaceContract = {
  address: string;
  chain: Chain;
};

/**
 * You need a marketplace contract on each of the chain you want to support
 * Only list one marketplace contract address for each chain
 */
export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [
  {
    address: "0xbA73965391b5f510635053e0909707B63b8f560F",
    chain: base,
  },
  {
    address: "0xe6926A9ae235c78678146B16E6e633D9be83A809",
    chain: polygon,
  },
];
