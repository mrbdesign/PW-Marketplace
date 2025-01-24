"use client";

import {
  Box,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { blo } from "blo";
import { shortenAddress } from "thirdweb/utils";
import { MediaRenderer, useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import { getOwnedERC1155s } from "@/extensions/getOwnedERC1155s";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { ProfileMenu } from "./Menu";
import { OwnedItem } from "./OwnedItem";
import { useState } from "react";

type Props = {
  address: string;
};

function ProfileSection(props: Props) {
  const { address } = props;
  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0]
  );

  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  const {
    data,
    isLoading: isLoadingOwnedNFTs,
  } = useReadContract(
    selectedCollection.type === "ERC1155" ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 100,
      queryOptions: {
        enabled: !!address,
        refetchInterval: 10000,
        retry: 3
      },
    }
  );

  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain.id
  )?.address;
  if (!marketplaceContractAddress) throw Error("No marketplace contract found");

  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });

  const { data: allValidListings, isLoading: isLoadingValidListings } =
    useReadContract(getAllValidListings, {
      contract: marketplaceContract,
      queryOptions: {
        enabled: true,
        refetchInterval: 10000,
        retry: 3
      },
    });

  const listings = allValidListings?.filter(
    (item) =>
      item.assetContractAddress.toLowerCase() === contract.address.toLowerCase() &&
      item.creatorAddress.toLowerCase() === address.toLowerCase() &&
      item.status === "ACTIVE"
  ) ?? [];

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 2, xl: 4 });

  return (
    <Box px={{ lg: "50px", base: "20px" }}>
      <Flex direction={{ lg: "row", md: "column", sm: "column" }} gap={5}>
        <Img
          src={ensAvatar ?? blo(address as `0x${string}`)}
          w={{ lg: 150, base: 100 }}
          rounded="8px"
        />
        <Box my="auto">
          <Heading>{ensName ?? "Unnamed"}</Heading>
          <Text color="gray">{shortenAddress(address)}</Text>
        </Box>
      </Flex>

      <Flex direction={{ lg: "row", base: "column" }} gap="10" mt="20px">
        <ProfileMenu
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        {isLoadingOwnedNFTs ? (
          <Box>
            <Text>Loading...</Text>
          </Box>
        ) : (
          <>
            <Box>
              <Flex direction="row" justifyContent="space-between" px="12px">
                <Tabs
                  variant="soft-rounded"
                  onChange={(index) => setTabIndex(index)}
                  isLazy
                  defaultIndex={0}
                >
                  <TabList>
                    <Tab>Owned ({data?.length})</Tab>
                    <Tab>Listed ({listings.length})</Tab>
                  </TabList>
                </Tabs>
                <Link
                  href={`/collection/${selectedCollection.chain.id}/${selectedCollection.address}`}
                  color="gray"
                >
                  View collection <ExternalLinkIcon mx="2px" />
                </Link>
              </Flex>
              <SimpleGrid columns={columns} spacing={4} p={4}>
                {tabIndex === 0 ? (
                  <>
                    {data && data.length > 0 ? (
                      <>
                        {data?.map((item) => (
                          <OwnedItem
                            key={item.id.toString()}
                            nftCollection={contract}
                            nft={item}
                          />
                        ))}
                      </>
                    ) : (
                      <Box>
                        <Text>
                          {isYou
                            ? "You"
                            : ensName
                            ? ensName
                            : shortenAddress(address)}{" "}
                          {isYou ? "do" : "does"} not own any NFT in this
                          collection
                        </Text>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {listings && listings.length > 0 ? (
                      <>
                        {listings?.map((item) => (
                          <Box
                            key={item.id}
                            rounded="12px"
                            as={Link}
                            href={`/collection/${contract.chain.id}/${
                              contract.address
                            }/token/${item.asset.id.toString()}`}
                            _hover={{ textDecoration: "none" }}
                            w={250}
                          >
                            <Flex direction="column">
                              <MediaRenderer
                                client={client}
                                src={item.asset.metadata.image}
                              />
                              <Text mt="12px">
                                {item.asset?.metadata?.name ?? "Unknown item"}
                              </Text>
                              <Text>Price</Text>
                              <Text>
                                {toEther(item.pricePerToken)}{" "}
                                {item.currencyValuePerToken.symbol}
                              </Text>
                            </Flex>
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Box>
                        <Text>You do not have any listing in this collection</Text>
                      </Box>
                    )}
                  </>
                )}
              </SimpleGrid>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
}

export { ProfileSection };
