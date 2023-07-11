import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider & {
      on: (eventName: string, callback: () => void) => void;
    }
  }
}


