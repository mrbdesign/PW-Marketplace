"use client";

// UI Components
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
} from "@chakra-ui/react";

// Third-party imports
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";

// Local imports
import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { SideMenu } from "./SideMenu";
import { logger } from "@/utils/logger";

// Custom Connect Button
import { ConnectButton } from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "line",
        "apple",
        "coinbase",
        "facebook",
        "twitch",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

function CustomConnectButton() {
  return (
    <div
      onClick={(e) => {
        const connectButton = e.currentTarget.querySelector("button");
        if (connectButton) {
          connectButton.click();
        }
      }}
    >
      <ConnectButton
        client={client}
        wallets={wallets}
        connectButton={{ label: "Connect" }}
        connectModal={{
          size: "wide",
          title: "Let's Friggin' Go !",
          showThirdwebBranding: false,
          termsOfServiceUrl:
            "https://www.mrbriandesign.com/terms",
          privacyPolicyUrl:
            "https://www.mrbriandesign.com/privacy",
        }}
      />
    </div>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box height="56px" w="56px" onClick={toggleColorMode} mr="10px">
      {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
    </Box>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });

  const fallbackAvatar = "/thumb/fallback-avatar.png";

  // Prioritize fallback avatar when no ENS avatar is available
  const avatarSource = ensAvatar || fallbackAvatar;

  console.log('ENS Avatar:', ensAvatar);
  console.log('Fallback Avatar:', fallbackAvatar);
  console.log('Avatar Source:', avatarSource);

  return (
    <Menu>
      <MenuButton as={Box} height="56px" _hover={{ cursor: "pointer" }}>
        <Flex direction="row" gap="5">
          <Box my="auto">
            <FiUser size={30} />
          </Box>
          <Image
            src={avatarSource}
            height="40px"
            rounded="8px"
            alt="Profile Avatar"
            fallbackSrc={fallbackAvatar}
            onError={(e) => {
              e.currentTarget.src = fallbackAvatar;
            }}
          />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem display="flex">
          <Box mx="auto">
            <CustomConnectButton />
          </Box>
        </MenuItem>
        <MenuItem 
          as={Link} 
          href="/profile" 
          _hover={{ textDecoration: "none" }}
          onClick={() => {
            logger.log("Profile link clicked");
          }}
        >
          Profile {ensName ? `(${ensName})` : ""}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  return (
    <Box py="30px" px="25px">
      <Flex direction="row" justifyContent="space-between">
        <Box my="auto">
          <Heading
            as={Link}
            href="/"
            _hover={{ textDecoration: "none" }}
            color="white"
            fontWeight="extrabold"
          >
            Welcome to PIXEL WORLD
          </Heading>
        </Box>
        <Box display={{ lg: "block", base: "none" }}>
          <ToggleThemeButton />
          {account && wallet ? (
            <ProfileButton address={account.address} wallet={wallet} />
          ) : (
            <CustomConnectButton />
          )}
        </Box>
        <SideMenu />
      </Flex>
    </Box>
  );
}
