const { ethers } = require("hardhat");

async function main() {

  const Upgoaled = await ethers.getContractFactory("UpGoaled");
  const upgoaled = await Upgoaled.deploy();
  await upgoaled.deployed();

  console.log(`upgoaled.sol has been deployed to ${upgoaled.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
