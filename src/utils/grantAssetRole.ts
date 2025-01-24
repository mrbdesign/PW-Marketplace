import { Contract } from "thirdweb";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";

export const ASSET_ROLE = "0x1c394fa56e1d0c96fb56f7bdf33b23650d5b5f47e3f6b3c129a0c89f763ef7a6";

export async function grantAssetRole(
  nftContract: Contract,
  chainId: number
) {
  const marketplaceContract = MARKETPLACE_CONTRACTS.find(
    (contract) => contract.chain.id === chainId
  );

  if (!marketplaceContract) {
    throw new Error("Marketplace contract not found for this chain");
  }

  const tx = await nftContract.write.grantRole([
    ASSET_ROLE,
    marketplaceContract.address
  ]);

  return tx;
}
