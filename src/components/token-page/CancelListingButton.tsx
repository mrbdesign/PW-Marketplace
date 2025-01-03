import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { sendAndConfirmTransaction } from "thirdweb";
import { cancelListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  account: Account;
  listingId: bigint;
};

export default function CancelListingButton(props: Props) {
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const { account, listingId } = props;
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelListing = async () => {
    try {
      setIsLoading(true);
      if (activeChain?.id !== nftContract.chain.id) {
        await switchChain(nftContract.chain);
      }

      const transaction = cancelListing({
        contract: marketplaceContract,
        listingId,
      });

      await sendAndConfirmTransaction({
        transaction,
        account,
      });

      toast({
        title: "Listing cancelled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refetchAllListings();
    } catch (error) {
      toast({
        title: "Error cancelling listing",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCancelListing}
      isLoading={isLoading}
      backgroundColor="#C41E3A"
      color="white"
      _hover={{ backgroundColor: "#A01830" }}
      size="sm"
    >
      Cancel Listing
    </Button>
  );
}
