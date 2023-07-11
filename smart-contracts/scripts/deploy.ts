import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const todo = await ethers.deployContract("Todo");

  console.log("Contract address:", await todo.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Contract address: 0xe7be316E67b48764f62c7a13F51b8913c58C622B

