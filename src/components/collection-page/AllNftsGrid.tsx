"use client";

import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { getNFTs as getNFTs1155 } from "thirdweb/extensions/erc1155";
import { getNFTs as getNFTs721 } from "thirdweb/extensions/erc721";
import { MediaRenderer, useReadContract } from "thirdweb/react";

// utils
import { debounce } from 'lodash';

export function AllNftsGrid() {
  const [loadedNFTs, setLoadedNFTs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;
  const { nftContract, type, supplyInfo } = useMarketplaceContext();

  const startTokenId = supplyInfo?.startTokenId ?? 0n;
  const totalItems: bigint = supplyInfo
    ? supplyInfo.endTokenId - supplyInfo.startTokenId + 1n
    : 0n;

  const { data: newNFTs } = useReadContract(
    type === "ERC1155" ? getNFTs1155 : getNFTs721,
    {
      contract: nftContract,
      start: Number(startTokenId) + currentPage * itemsPerPage,
      count: itemsPerPage,
    }
  );

  useEffect(() => {
    if (newNFTs) {
      setLoadedNFTs(prev => [...prev, ...newNFTs]);
    }
  }, [newNFTs]);

  // Debounce the handleScroll function
  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        loadedNFTs.length < Number(totalItems)
      ) {
        setCurrentPage(prev => prev + 1);
      }
    }, 200), // Adjust the debounce delay as needed
    [loadedNFTs.length, totalItems]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel any pending debounced calls
    };
  }, [handleScroll]);

  // const columns = useBreakpointValue({
  //   base: 1,
  //   sm: 2,
  //   md: 4,
  //   lg: 4,
  //   xl: 5,
  // });
  const columns = 2; // Set a fixed number of columns

  return (
    <SimpleGrid columns={columns} spacing={4} p={4} mx="auto" mt="20px">
      {loadedNFTs.length > 0 ? (
        loadedNFTs.map((item) => (
          <Box
            key={item.id}
            rounded="12px"
            as={Link}
            href={`/collection/${nftContract.chain.id}/${
              nftContract.address
            }/token/${item.id.toString()}`}
            _hover={{ textDecoration: "none" }}
          >
            <Flex direction="column">
              <MediaRenderer client={client} src={item.metadata.image} />
              <Text>{item.metadata?.name ?? "Unknown item"}</Text>
            </Flex>
          </Box>
        ))
      ) : (
        <Box mx="auto">Loading...</Box>
      )}
    </SimpleGrid>
  );
}
