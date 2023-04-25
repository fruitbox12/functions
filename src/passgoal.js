const { ethers } = require("hardhat");
const fs = require("fs");
require('dotenv').config();

// Contract Artifacts
const upgold_artifacts = require("../artifacts/contracts/upgold.sol/UpGoaled.json");
// Provider
const provider = new ethers.providers.JsonRpcProvider(process.env.NEON_NETWORK_URL);
// Signer
const signer = new ethers.Wallet(process.env.NEON_PRIVATE_KEY_1, provider);

async function main() {
  const Upgold = await ethers.getContractFactory("UpGold");
  const upgold = await Upgold.deploy();
  await upgold.deployed();

  console.log(`upgold.sol has been deployed to ${upgold.address}`);

  // Contract
  const upgold_contract = new ethers.Contract(upgold.address, upgold_artifacts.abi, signer);

  // Pass Data from passGoal.json into passGoal function
  fs.readFile("../GoalStake/goalPass.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    console.log("File data:", jsonString);
    try {
      // Display Data as a String
      const passGoal = JSON.parse(jsonString);
      console.log("User Id is:", passGoal.user_id);
      console.log("Goal Id is:", passGoal.goal_id); 

      // Pass Data into Smart Contract
      const transfer = await upgold_contract.passGoal(passGoal.user_id, passGoal.goal_id);
      
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
