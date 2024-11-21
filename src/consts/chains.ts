import { defineChain } from "thirdweb";
import { base } from "thirdweb/chains";

// For Base mainnet
export const baseMainnet = defineChain(8453);

// For Base testnet (Goerli)
export const baseTestnet = defineChain(84531);

// Export the one you need
export { baseMainnet as base };
