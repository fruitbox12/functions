const { ethers } = require("hardhat");

async function main() {

  const Message = await ethers.getContractFactory("HelloWorld");
  const message = await Message.deploy("Infinity Loop Drive");

  await message.deployed();

  console.log(`message.sol has been deployed to ${message.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});