import { Box, Flex, Link, Text, Image } from "@chakra-ui/react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export function Footer() {
  return (
    <Box as="footer" py={2} mt="auto" pt={20} bg="black" color="white">
      <Flex
        direction="row"
        justify="center"
        align="center"
        gap={4}
      >
        <Image
          src="/thumb/footer.png"
          alt="Footer Logo"
          height="30px" // Adjust the height as needed
          mr={4} // Add some right margin for spacing
        />
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
        <Text>©2025 PIXEL WORLD by Mr.Brian Design. All Rights Reserved. Powered by Shoehorn Labs</Text>
      </Flex>
    </Box>
  );
}
