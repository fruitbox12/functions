const { ethers } = require("hardhat");
const prompt = require('prompt-sync')();
const fs = require("fs");
require('dotenv').config();

// Contract Artifacts
const upgoaled_artifacts = require("../artifacts/contracts/upgoaled.sol/UpGoaled.json");
const token_artifacts = require("../artifacts/contracts/token.sol/Token.json");
// Provider
const provider = new ethers.providers.JsonRpcProvider(process.env.NEON_NETWORK_URL);
// Signer
const owner_signer = new ethers.Wallet(process.env.NEON_PRIVATE_KEY_1, provider);
const user_signer = new ethers.Wallet(process.env.NEON_PRIVATE_KEY_2, provider);

async function main() {

  // Deploy upgoaled.sol with owner wallet
  const Upgoaled = await ethers.getContractFactory("UpGoaled");
  const upgoaled = await Upgoaled.connect(owner_signer).deploy();
  await upgoaled.deployed();

  // Deploy token.sol with user wallet
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.connect(user_signer).deploy();
  await token.deployed();

  console.log(`upgoaled.sol has been deployed to ${upgoaled.address}`);
  console.log(`token.sol has been deployed to ${token.address}`);

  // Contract
  const upgoaled_contract = new ethers.Contract(upgoaled.address, upgoaled_artifacts.abi, owner_signer);
  const token_contract = new ethers.Contract(token.address, token_artifacts.abi, user_signer);

  // Mint 1000 USDC Tokens
  const mint = await token_contract.mint(token.address, 1000);
  const mint_receipt = await mint.wait();
  console.log(mint_receipt);

  // Read Total Supply Minted from Smart Contract
  const supply = await token_contract.totalSupply();
  console.log(`The total supply minted after this transaction is ${supply}!`);

  // Approve 100 tokens to upgoaled contract
  const approve = await token_contract.approve(upgoaled.address, 100);
  const approve_receipt = await approve.wait();
  console.log(approve_receipt);
  console.log("100 new tokens have been approved to upgoaled.sol!");

  // Name your Goal Pool!
  const name = prompt("Name your new Goal Pool:");
  const createGoalPoolOwner = await upgoaled_contract.createGoalPoolOwner(name);
  const createGoalPoolOwner_receipt = await createGoalPoolOwner.wait();
  console.log(createGoalPoolOwner_receipt);
  console.log(`Goal Pool has been named ${name} successfully!`);

  // Create your Goal Pool
  const title = prompt("Title of your Goal Pool:");
  const description = prompt("Description of your Goal Pool:");
  const goalPoolId = prompt("Enter your Goal Pool Id:");
  const expiryDate = 1682310000;
  const createGoalOwner = await upgoaled_contract.createGoalOwner(title, description, goalPoolId, expiryDate);
  const createGoalOwner_receipt  = await createGoalOwner.wait();
  console.log(createGoalOwner_receipt);
  console.log("Goal Pool has been successfully created!");

  // Enter your user details
  const username = prompt("Enter your username:");
  const createUser = await upgoaled_contract.connect(user_signer).createUser(username, process.env.NEON_USER_ADDRESS, token.address);
  const createUser_receipt = await createUser.wait();
  console.log(createUser_receipt);
  console.log("User Details have been successully updated!")

  // Call Goal Pool Count
  const goalPoolCount = await upgoaled_contract.goalPoolCount();
  console.log(`Goal Pool Count is ${goalPoolCount}`);

  // Call User Count
  const userCount = await upgoaled_contract.userCount();
  console.log(`User Count is ${userCount}`);

  // Call Goal Information
  const goals = await upgoaled_contract.goals(goalPoolId);
  console.log(`Goal Information is ${goals}`);

  // User joining goal and staking
  const user_id = prompt("Enter your User Id:");
  const joinGoalAndStake = await upgoaled_contract.connect(user_signer).joinGoalAndStake(goalPoolId, 100, token.address, user_id);
  const joinGoalAndStake_receipt = await joinGoalAndStake.wait();
  console.log(joinGoalAndStake_receipt);
  console.log("User has joined and staked into the goal pool successfully!")

  // Call the bool function is goal expired, true means the goal has expired
  const isGoalExpired = await upgoaled_contract.isGoalExpired(goalPoolId);
  console.log(isGoalExpired);

  // Call Goal Information again
  const goals2 = await upgoaled_contract.goals(goalPoolId);
  console.log(`Goal Information is ${goals2}`);

  // Write a json file with the variables for the pass goal function, user_id & goal_id
  const passgoal_info = {
    user_id_info: user_id,
    goal_id_info: goalPoolId,
  }
  const jsonString = JSON.stringify(passgoal_info)
  fs.writeFile('../GoalStake/api.json', jsonString, err => {
     if (err) {
        console.log('Error writing passgoal json file', err)
     } else {
        console.log('Successfully wrote passgoal json file')
     }
  })

  // Wait 3 seconds
  await new Promise(resolve => setTimeout(() => resolve(), 3000));

  // Parse Data from api.json into the pass goal function in the smart contract
  fs.readFile("../GoalStake/api.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    console.log("File data:", jsonString);
    
    const api = JSON.parse(jsonString);
    console.log("User Id is", api.user_id_info); 
    if (typeof api.user_id_info === 'string') {
        console.log('Variable is a string!');
    }
    else {
        console.log('Variable is not a string!');
    }
    console.log("Goal Id is", api.goal_id_info); 
    if (typeof api.goal_id_info === 'string') {
        console.log('Variable is a string!');
    }
    else {
        console.log('Variable is not a string!');
    }

    // Pass the previously Json data, now string, into the passGoal function in the smart contract
    const passGoal = await upgoaled_contract.passGoal(api.user_id_info, api.goal_id_info);
    const passGoal_receipt = await passGoal.wait();
    console.log(passGoal_receipt);
    console.log("Json Data has been successully passed into the passGoal function in the smart contract! :0")

    // User can claim their rewards
    // const claim = prompt("Do you wish to claim your rewards? Input y/n");
    // if (claim == "y") {
    //   const claimRewards = await upgoaled_contract.connect(user_signer).claimRewards(api.user_id_info, api.goal_id_info, token.address);
    //   const claimRewards_receipt = await claimRewards.wait();
    //   console.log(claimRewards_receipt);
    //   console.log("User Rewards have been claimed successfully!")
    // }
    //   else {
    //     console.log("...");
    //   }
  }); 

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
