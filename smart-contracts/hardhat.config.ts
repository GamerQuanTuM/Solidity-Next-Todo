import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'

const config: HardhatUserConfig = { 
  solidity: {
    version: "0.8.18", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL,
      accounts: [
        process.env.PRIVATE_KEY!,
      ],
    },
  },
}

export default config;
