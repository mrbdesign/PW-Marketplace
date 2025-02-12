import { type BaseTransactionOptions, type NFT, readContract } from "thirdweb";
import {
  balanceOfBatch,
  getNFT,
  nextTokenIdToMint,
} from "thirdweb/extensions/erc1155";

export type GetERC1155sParams = {
  start?: number;
  count?: number;
  owner: string;
  requestPerSec?: number;
  batchSize?: number;
};

export async function getOwnedERC1155s(
  options: BaseTransactionOptions<GetERC1155sParams>
): Promise<NFT[]> {
  const { contract, owner, batchSize = 50, requestPerSec = 25 } = options;

  const maxId = await Promise.allSettled([
    readContract({
      contract: contract,
      method: "function nextTokenId() view returns (uint256)",
      params: [],
    }),
    nextTokenIdToMint(options),
  ]).then(([_next, _nextToMint]) => {
    if (_next.status === "fulfilled") return _next.value;
    if (_nextToMint.status === "fulfilled") return _nextToMint.value;
    throw Error("Contract doesn't have required extension");
  });

  const processInBatches = async () => {
    const allOwnedNFTs: NFT[] = [];
    for (let startIdx = 0; startIdx < Number(maxId); startIdx += batchSize) {
      const endIdx = Math.min(startIdx + batchSize, Number(maxId));
      const owners = Array(endIdx - startIdx).fill(owner);
      const tokenIds = Array.from({ length: endIdx - startIdx }, (_, i) => BigInt(i + startIdx));

      const batchBalances = await balanceOfBatch({
        ...options,
        owners,
        tokenIds,
      });

      const ownedInBatch = batchBalances
        .map((balance, idx) => ({
          tokenId: tokenIds[idx],
          balance,
        }))
        .filter(item => item.balance > 0);

      if (ownedInBatch.length > 0) {
        const nftsInBatch = await Promise.all(
          ownedInBatch.map(item =>
            getNFT({ ...options, tokenId: item.tokenId })
          )
        );

        allOwnedNFTs.push(
          ...nftsInBatch.map((nft, idx) => ({
            ...nft,
            owner,
            quantityOwned: ownedInBatch[idx]?.balance || 0n,
          }))
        );
      }

      if (requestPerSec) {
        await new Promise(resolve => 
          setTimeout(resolve, 1000 / requestPerSec)
        );
      }
    }

    return allOwnedNFTs;
  };

  const allNFTs = await processInBatches();

  if (options.start || options.count) {
    const start = options.start || 0;
    const count = options.count || 100;
    return allNFTs.slice(start, start + count);
  }

  return allNFTs;
}
