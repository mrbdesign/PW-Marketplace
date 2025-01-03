import { NATIVE_TOKEN_ICON_MAP, Token } from "@/consts/supported_tokens";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Image,
  useToast,
  Box,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { NATIVE_TOKEN_ADDRESS, sendAndConfirmTransaction } from "thirdweb";
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import {
  isApprovedForAll as isApprovedForAll721,
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import { createListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  tokenId: bigint;
  account: Account;
};

export function CreateListing(props: Props) {
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { tokenId, account } = props;
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [currency, setCurrency] = useState<Token>();
  const [isLoading, setIsLoading] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 7 days from now
  );
  const toast = useToast();

  const {
    nftContract,
    marketplaceContract,
    refetchAllListings,
    type,
    supportedTokens,
  } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  const nativeToken: Token = {
    tokenAddress: NATIVE_TOKEN_ADDRESS,
    symbol: chain.nativeCurrency?.symbol || "ETH",
    icon: NATIVE_TOKEN_ICON_MAP[chain.id] || "",
  };

  const options: Token[] = [nativeToken].concat(supportedTokens);

  const handleCreateListing = async () => {
    try {
      setIsLoading(true);
      const value = priceRef.current?.value;
      if (!value) {
        toast({
          title: "Please enter a price for this listing",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        return;
      }

      if (!currency) {
        toast({
          title: "Please select a currency for the listing",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        return;
      }

      if (activeChain?.id !== nftContract.chain.id) {
        await switchChain(nftContract.chain);
      }

      const _qty = BigInt(qtyRef.current?.value ?? 1);
      if (type === "ERC1155") {
        if (!_qty || _qty <= 0n) {
          toast({
            title: "Error",
            description: "Invalid quantity",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
          return;
        }
      }

      const checkApprove = type === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;

      const isApproved = await checkApprove({
        contract: nftContract,
        owner: account.address,
        operator: marketplaceContract.address,
      });

      if (!isApproved) {
        const setApproval = type === "ERC1155" ? setApprovalForAll1155 : setApprovalForAll721;

        const approveTx = setApproval({
          contract: nftContract,
          operator: marketplaceContract.address,
          approved: true,
        });

        await sendAndConfirmTransaction({
          transaction: approveTx,
          account,
        });
      }

      const transaction = createListing({
        contract: marketplaceContract,
        assetContractAddress: nftContract.address,
        tokenId,
        quantity: type === "ERC721" ? 1n : _qty,
        currencyContractAddress: currency?.tokenAddress,
        pricePerToken: value,
        startTimestamp: new Date(),
        endTimestamp: expirationDate,
      });

      await sendAndConfirmTransaction({
        transaction,
        account,
      });

      toast({
        title: "Success",
        description: "Your NFT has been listed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      refetchAllListings();
    } catch (error) {
      console.error("Listing error:", error);
      toast({
        title: "Error",
        description: "Failed to create listing: " + error.message,
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <br />
      <Flex direction="column" w={{ base: "90vw", lg: "430px" }} gap="10px">
        {type === "ERC1155" ? (
          <>
            <Flex
              direction="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Box>
                <Text>Price</Text>
                <Input
                  type="number"
                  ref={priceRef}
                  placeholder="Enter a price"
                />
              </Box>
              <Box>
                <Text>Quantity</Text>
                <Input
                  type="number"
                  ref={qtyRef}
                  defaultValue={1}
                  placeholder="Quantity to sell"
                />
              </Box>
            </Flex>
          </>
        ) : (
          <>
            <Text>Price</Text>
            <Input
              type="number"
              ref={priceRef}
              placeholder="Enter a price for your listing"
            />
          </>
        )}

        <FormControl>
          <FormLabel>Listing Duration</FormLabel>
          <Input
            type="datetime-local"
            value={expirationDate.toISOString().slice(0, 16)}
            onChange={(e) => setExpirationDate(new Date(e.target.value))}
            min={new Date().toISOString().slice(0, 16)}
          />
        </FormControl>

        <Menu>
          <MenuButton minH="48px" as={Button} rightIcon={<ChevronDownIcon />}>
            {currency ? (
              <Flex direction="row">
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src={currency.icon}
                  mr="12px"
                />
                <Text my="auto">{currency.symbol}</Text>
              </Flex>
            ) : (
              "Select currency"
            )}
          </MenuButton>
          <MenuList>
            {options.map((token) => (
              <MenuItem
                minH="48px"
                key={token.tokenAddress}
                onClick={() => setCurrency(token)}
                display={"flex"}
                flexDir={"row"}
              >
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src={token.icon}
                  ml="2px"
                  mr="14px"
                />
                <Text my="auto">{token.symbol}</Text>
                {token.tokenAddress.toLowerCase() ===
                  currency?.tokenAddress.toLowerCase() && (
                  <CheckIcon ml="auto" />
                )}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Button
          isLoading={isLoading}
          isDisabled={!currency}
          onClick={handleCreateListing}
        >
          List
        </Button>
      </Flex>
    </>
  );
}
