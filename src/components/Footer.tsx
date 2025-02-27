import Link from "next/link";
import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export function Footer() {
  return (
    <Box
      as="footer"
      py={4}
      mt="auto"
      pt={10} // Reduced padding top to 10
      bg="white" // Added background color
      color="gray.700" // Added text color
      _dark={{ bg: "gray.900", color: "gray.300" }} // Dark mode styles
    >
      <Flex
        direction={{ base: "column", md: "row" }} // Stack on small screens
        justify="space-between"
        align="center"
        mx="auto"
        px={{ base: 4, md: 6 }}
        maxW="container.xl" // Added max width
      >
        <Flex align="center" gap={2} mb={{ base: 2, md: 0 }}>
          <Image
            src="/thumb/footer.png"
            alt="Logo"
            width={300}  // Doubled width
            height={64} // Doubled height
            className="h-8 w-auto"
          />
        </Flex>

        <Text textAlign="center" fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} PIXEL WORLD by Mr.Brian Design. All rights reserved. Powered by Shoehorn Labs.
        </Text>

        <Flex gap={4} align="center">
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
        </Flex>
      </Flex>
    </Box>
  );
}
