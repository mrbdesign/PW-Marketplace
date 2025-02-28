import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Button, useToast } from "@chakra-ui/react";
import {
  type Hex,
  NATIVE_TOKEN_ADDRESS,
  getContract,
  sendAndConfirmTransaction,
  sendTransaction,
  toTokens,
  waitForReceipt,
} from "thirdweb";
import { allowance, approve, decimals } from "thirdweb/extensions/erc20";
import {
  type DirectListing,
  buyFromListing,
} from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { logger } from "@/utils/logger"; // Import the logger

const buyButtonStyles = {
  backgroundColor: "#9ACD32",
  color: "white",
  transition: "all 0.3s ease",
  width: "100%",
  minHeight: "80px", // This will definitely set the height
  py: 8, // Additional padding to enforce height
  fontSize: "2xl", // Chakra UI font size scale
  fontWeight: "bold",
  _hover: {
    backgroundColor: "#8BB82D",
    transform: "scale(1.05)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
  }
};

type Props = {
  listing: DirectListing;
  account: Account;
};

export default function BuyFromListingButton(props: Props) {
  const { account, listing } = props;
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const toast = useToast();

  return (
    <Button
      sx={buyButtonStyles}
      onClick={async () => {
        if (activeChain?.id !== nftContract.chain.id) {
          await switchChain(nftContract.chain);
        }
        try {
          if (
            listing.currencyContractAddress.toLowerCase() !==
            NATIVE_TOKEN_ADDRESS.toLowerCase()
          ) {
            const customTokenContract = getContract({
              address: listing.currencyContractAddress as Hex,
              client,
              chain: nftContract.chain,
            });
            const result = await allowance({
              contract: customTokenContract,
              owner: account.address,
              spender: marketplaceContract.address as Hex,
            });

            if (result < listing?.pricePerToken) {
              const _decimals = await decimals({
                contract: customTokenContract,
              });
              const transaction = approve({
                contract: customTokenContract,
                spender: marketplaceContract.address as Hex,
                amount: toTokens(listing?.pricePerToken, _decimals),
              });
              await sendAndConfirmTransaction({ transaction, account });
            }
          }

          const transaction = buyFromListing({
            contract: marketplaceContract,
            listingId: listing.id,
            quantity: listing.quantity,
            recipient: account.address,
          });
          logger.log(transaction); // Use logger.log
          const receipt = await sendTransaction({
            transaction,
            account,
          });
          await waitForReceipt({
            transactionHash: receipt.transactionHash,
            client,
            chain: nftContract.chain,
          });
          toast({
            title:
              "Purchase completed! The asset(s) should arrive in your account shortly",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          refetchAllListings();
        } catch (err) {
          logger.error(err); // Use logger.error
          if ((err as Error).message.startsWith("insufficient funds for gas")) {
            toast({
              title: "You don't have enough funds for this purchase.",
              description: `Make sure you have enough gas for the transaction + ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`,
              status: "error",
              isClosable: true,
              duration: 7000,
            });
          }
        }
      }}
    >
      Buy Now
    </Button>
  );
}
