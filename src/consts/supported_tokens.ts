import type { Chain } from "thirdweb";
import { base } from "./chains";

export type Token = {
  tokenAddress: string;
  symbol: string;
  icon: string;
};

export type SupportedTokens = {
  chain: Chain;
  tokens: Token[];
};

export const NATIVE_TOKEN_ICON_MAP: { [key in Chain["id"]]: string } = {
  8453: "/native-token-icons/eth.png", // For Base mainnet
  84531: "/native-token-icons/eth.png", // For Base testnet
};

/**
 * By default you create listings with the payment currency in the native token of the network (eth, avax, matic etc.)
 *
 * If you want to allow users to transact using different ERC20 tokens, you can add them to the config below
 * Keep in mind this is for front-end usage. Make sure your marketplace v3 contracts accept the ERC20s
 * check that in https://thirdweb.com/<chain-id>/<marketplace-v3-address>/permissions -> Asset
 * By default the Marketplace V3 contract supports any asset (token)
 */
 export const SUPPORTED_TOKENS: SupportedTokens[] = [
  {
    chain: base,
    tokens: [
      {
        tokenAddress: "0x77b4Dd848214571D1119AFf3cD34228C6089954b",
        symbol: "PERX",
        icon: "/erc20-icons/perx.png",
      },
      
    ],
  },
];