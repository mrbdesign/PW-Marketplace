import { getContract } from "thirdweb";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { client } from "@/consts/client";
import { grantRole } from "thirdweb/extensions/permissions";

export const ASSET_ROLE = "0x1c394fa56e1d0c96fb56f7bdf33b23650d5b5f47e3f6b3c129a0c89f763ef7a6";

export async function grantAssetRole(chain: number, assetAddress: string) {
  const marketplaceContract = MARKETPLACE_CONTRACTS.find(
    (item) => item.chain.id === chain
  );
  if (!marketplaceContract) throw new Error("Chain not supported");

  const contract = getContract({
    address: marketplaceContract.address,
    chain: marketplaceContract.chain,
    client
  });

  return grantRole({
    contract,
    role: ASSET_ROLE,
    targetAccountAddress: assetAddress
  });
}
