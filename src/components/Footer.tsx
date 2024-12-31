import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export function Footer() {
  return (
    <Box as="footer" py={4} mt="auto" pt={40}>
      <Flex 
        direction="row" 
        justify="center" 
        align="center" 
        gap={4}
      >
        <Link 
          href="https://x.com/mrbriandesign" 
          isExternal
          _hover={{ color: "#9acd32" }}
        >
          <FaXTwitter size={24} />
        </Link>
        <Link 
          href="https://discord.gg/ZxU7aC4KZZ" 
          isExternal
          _hover={{ color: "#9acd32" }}
        >
          <FaDiscord size={24} />
        </Link>
        <Text>Powered by Shoehorn Labs</Text>
      </Flex>
    </Box>
  );
}
