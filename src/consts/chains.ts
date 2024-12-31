import { defineChain } from "thirdweb";
import { base, polygon } from "thirdweb/chains";

// For Base mainnet
export const baseMainnet = defineChain(8453);

// For Base testnet (Goerli)
export const baseTestnet = defineChain(84531);

// Export the chains we need
export { baseMainnet as base, polygon };
