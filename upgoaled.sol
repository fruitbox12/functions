// last modified 7:00pm 20/04/2023
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UpGoaled is Ownable {
    // User struct to store user information
    struct User {
        string userId; // Use the username as the user ID
        address userAddress; // Wallet address of the user
        uint[] goals; // List of goal IDs associated with the user
    }

    // Goal struct to store goal information
    struct Goal {
        string title;
        uint stake;
        bool completed;
        uint totalFailedStake;
        uint successfulParticipants;
        uint[] participants;
    }

    // GoalPool struct to store goal pool information
    struct GoalPool {
        string name; // Name of the goal pool
        uint[] goals; // List of goal IDs in the goal pool
    }

    // GoalParticipation struct to store staked amounts, failed stakes, and claimed rewards
    struct GoalParticipation {
        uint stakedAmount;
        bool failed;
        bool passed;
        bool rewardsClaimed;
    }

    uint public userCount; // Counter for the total number of users
    uint public goalCount; // Counter for the total number of goals
    uint public goalPoolCount; // Counter for the total number of goal pools

    // Maximum number of goal pools allowed
    uint public constant MAX_GOAL_POOLS = 3;
    uint public constant MAX_GOALS_PER_POOL = 3;

    // Mappings to store user, goal, and goal pool data
    mapping(uint => User) public users;
    mapping(uint => Goal) public goals;
    mapping(uint => GoalPool) public goalPools;
    mapping(uint => mapping(uint => GoalParticipation)) public goalParticipations;
    mapping(address => bool) public addressUsed;
    mapping(string => bool) public usernameUsed;
    mapping(uint => mapping(uint => bool)) public userParticipatedInGoal;
    
    // Events
    event UserCreated(uint indexed userId, string name, address userAddress);
    event GoalPoolCreated(uint indexed goalPoolId, string name);
    event GoalCreated(uint indexed goalId, string title, uint stake, uint goalPoolId);
    event GoalFailed(uint indexed userId, uint indexed goalId);
    event PassedGoal(uint indexed userId, uint indexed goalId);
    event RewardsClaimed(uint indexed userId, uint indexed goalId);
    event UserJoinedGoal(uint indexed userId, uint indexed goalId, uint stake);


    // Modifier to check if the user has not been created yet
    modifier userNotCreated(address _userAddress) {
        require(!addressUsed[_userAddress], "User can only create an account once");
        _;
    }
    // Function to create a new goal pool with a name (Only Owner) 
    function createGoalPoolOwner(string memory _name) public onlyOwner {
        require(goalPoolCount < MAX_GOAL_POOLS, "Maximum number of goal pools reached");

        goalPoolCount++;
        goalPools[goalPoolCount] = GoalPool(_name, new uint[](0));

    emit GoalPoolCreated(goalPoolCount, _name);
    }
    // Function to create a new goal with a title, and goal pool ID
    function createGoalOwner(string memory _title, uint _goalPoolId) public onlyOwner {
        require(goalPools[_goalPoolId].goals.length < MAX_GOALS_PER_POOL, "Maximum number of goals per pool reached");

        goalCount++;
        goals[goalCount] = Goal(_title, 0, false, 0, 0, new uint[](0));

        goalPools[_goalPoolId].goals.push(goalCount);

        emit GoalCreated(goalCount, _title, 0, _goalPoolId);
    }

    // Function to create a new user with a username, wallet address, and USDC token address
    function createUser(string memory _name, address _userAddress, address _TokenAddress) public userNotCreated(_userAddress) {
        // Check if the user's wallet has more than 50 USDC tokens
        IERC20 USDCToken = IERC20(_TokenAddress);
        uint userTokenBalance = USDCToken.balanceOf(_userAddress);
        require(userTokenBalance >= 5, "User must have at least 50 USDC tokens");

        userCount++;
        string memory userId = _name; // Use the username as the user ID
        users[userCount] = User(userId, _userAddress, new uint[](0));

        addressUsed[_userAddress] = true;

        emit UserCreated(userCount, _name, _userAddress);
    }

     // Function for users to join a goal and stake tokens
    function joinGoalAndStake(uint _goalId, uint _stake, address _tokenAddress, uint _userId) public {
        // Ensure the user has not already participated in the goal
        require(!userParticipatedInGoal[_userId][_goalId], "User has already participated in the goal");

        // Ensure the user approves the contract to transfer tokens on their behalf
        IERC20 token = IERC20(_tokenAddress);
        require(token.allowance(msg.sender, address(this)) >= _stake, "Token allowance not sufficient");

        // Require that the user must stake tokens to join the goal
        require(_stake > 0, "User must stake tokens to join the goal");

        // Transfer tokens from the user to the contract
        token.transferFrom(msg.sender, address(this), _stake);

        // Add the user to the goal
        goals[_goalId].participants.push(_userId);

        // Record user's participation in the goal
        userParticipatedInGoal[_userId][_goalId] = true;

        // Update the stakedAmount in the goalParticipations mapping
        goalParticipations[_userId][_goalId].stakedAmount = _stake;

        // Update the total stake for the goal in the goals mapping
        goals[_goalId].stake += _stake;

        emit UserJoinedGoal(_userId, _goalId, _stake);

    }
    
    // Function to mark a user as failed for a goal
    function failGoal(uint _userId, uint _goalId) public onlyOwner {
        // Ensure the user has participated in the goal
        require(userParticipatedInGoal[_userId][_goalId], "User must have participated in the goal");

        // Ensure the goal is not already completed
        require(!goals[_goalId].completed, "Goal must not be completed");

        // Update the failed status in the goalParticipations mapping
        goalParticipations[_userId][_goalId].failed = true;

        // Increment the totalFailedStake for the goal
        goals[_goalId].totalFailedStake += goalParticipations[_userId][_goalId].stakedAmount;

        emit GoalFailed(_userId, _goalId);
    }
    
    // Function to mark a user as having passed the goal
    function passGoal(uint _userId, uint _goalId) public onlyOwner {
        // Ensure the user has participated in the goal
        require(userParticipatedInGoal[_userId][_goalId], "User must have participated in the goal");

        // Ensure the goal is not already completed
        require(!goals[_goalId].completed, "Goal must not be completed");

        // Ensure the user has not already been marked as failed
        require(!goalParticipations[_userId][_goalId].failed, "User must not be marked as failed");

        // Mark the user as passed in the goalParticipations mapping
        goalParticipations[_userId][_goalId].passed = true;

        // Increment the successfulParticipants count for the goal
        goals[_goalId].successfulParticipants++;

        // You may also choose to emit an event here, similar to the GoalFailed event
        emit PassedGoal(_userId, _goalId);
    }
    
    // Function to allow a user to claim rewards after completing a goal
    function claimRewards(uint _userId, uint _goalId, address _tokenAddress) public {
        // Ensure the goal is completed
        require(goals[_goalId].completed, "Goal must be completed");

        // Ensure the user has participated in the goal
        require(userParticipatedInGoal[_userId][_goalId], "User must have participated in the goal");

        // Ensure the user has not already claimed their rewards
        require(!goalParticipations[_userId][_goalId].rewardsClaimed, "User has already claimed rewards");

        // Ensure the user has staked tokens in the goal
        uint stakedAmount = goalParticipations[_userId][_goalId].stakedAmount;
        require(stakedAmount > 0, "User must have staked tokens in the goal");

        // Ensure the user has passed the goal
        require(goalParticipations[_userId][_goalId].passed, "User must have passed the goal");

        // Calculate the user's share of the rewards from the failed stakes
        uint totalFailedStake = goals[_goalId].totalFailedStake;
        uint successfulParticipants = goals[_goalId].successfulParticipants;
        uint userRewards = (stakedAmount + totalFailedStake) / successfulParticipants;

        // Transfer the rewards to the user
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, userRewards);

        // Update the rewardsClaimed status in the goalParticipations mapping
        goalParticipations[_userId][_goalId].rewardsClaimed = true;

        emit RewardsClaimed(_userId, _goalId);
    }
   
}
