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
  } catch (error: any) {
    toast({
      title: "Error cancelling listing",
      description: error?.message || "Unknown error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};
