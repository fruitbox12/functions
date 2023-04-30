import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

describe("UpGold", function () {
  let UpGold: ContractFactory;
  let upGold: Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    UpGold = await ethers.getContractFactory("UpGold");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    upGold = await UpGold.deploy();
    await upGold.deployed();
  });

  it("Should create a user successfully", async function () {
    await upGold.createUser("Alice", addr1.address, "0x1234...");
    const user = await upGold.users(1);
    expect(user.userId).to.equal("Alice");
    expect(user.userAddress).to.equal(addr1.address);
  });

  it("Should fail to create a user with the same address", async function () {
    await upGold.createUser("Alice", addr1.address, "0x1234...");
    await expect(upGold.createUser("Bob", addr1.address, "0x1234...")).to.be.revertedWith("User can only create an account once");
  });

  it("Should create a goal pool by owner", async function () {
    await upGold.connect(owner).createGoalPoolOwner("Fitness Pool");
    const goalPool = await upGold.goalPools(1);
    expect(goalPool.name).to.equal("Fitness Pool");
  });

  it("Should create a goal by owner", async function () {
    await upGold.connect(owner).createGoalPoolOwner("Fitness Pool");
    await upGold.connect(owner).createGoalOwner("Lose Weight", 1);
    const goal = await upGold.goals(1);
    expect(goal.title).to.equal("Lose Weight");
  });

  it("Should join a goal and stake tokens", async function () {
    // Replace this address with the actual USDC token address on your network
    const usdcTokenAddress = "0x1234...";

    // Create user, goal pool, and goal
    await upGold.createUser("Alice", addr1.address, usdcTokenAddress);
    await upGold.connect(owner).createGoalPoolOwner("Fitness Pool");
    await upGold.connect(owner).createGoalOwner("Lose Weight", 1);

    // Set allowance to 1000 USDC tokens for the contract
    // Note: This part is a placeholder and should be replaced with the actual token contract interactions
    await ethers.provider.send("hardhat_setBalance", [upGold.address, "0x3635C9ADC5DEA0000"]);

    // Join the goal with 500 USDC tokens staked
    await upGold.connect(addr1).joinGoalAndStake(1, 500, usdcTokenAddress, 1);
    const goalParticipation = await upGold.goalParticipations(1, 1);
    expect(goalParticipation.stakedAmount).to.equal(500);
  });

  // Add more tests as needed
});
