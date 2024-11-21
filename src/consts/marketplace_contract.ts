import type { Chain } from "thirdweb";
import { base } from "./chains";

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

];
