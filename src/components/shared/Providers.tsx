"use client";

// UI and Theme
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { chakraTheme, chakraThemeConfig } from "@/consts/chakra";

// Data Management
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Web3
import { ThirdwebProvider } from "thirdweb/react";

// Types
import type { ReactNode } from "react";

// Query Client Instance
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <ColorModeScript initialColorMode={chakraThemeConfig.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
