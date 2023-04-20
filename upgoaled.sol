// SPDX-License-Identifier: MIT

// This is the (MVP) contract. The goal and pool abnd goals can only be created by the  contract owner 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UpGold is Ownable {
    // User struct to store user information
    struct User {
        address userAddress; // Wallet address of the user
        uint[] goals; // List of goal IDs associated with the user
    }

    // Goal struct to store goal information
    struct Goal {
        string title; // Title of the goal
        uint stake; // Amount of stake for the goal
        uint[] participants; // List of user IDs participating in the goal
        bool completed; // Whether the goal is completed
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
    event UserCreated(uint indexed msg.sender, string name, address userAddress);
    event GoalPoolCreated(uint indexed goalPoolId, string name);
    event GoalCreated(uint indexed goalId, string title, uint stake, uint goalPoolId);
    event GoalFailed(uint indexed msg.sender, uint indexed goalId);
    event RewardsClaimed(uint indexed msg.sender, uint indexed goalId);
    event UserJoinedGoal(uint indexed msg.sender, uint indexed goalId, uint stake);
// inital function to create a goal pool;
    function createGoalPoolOwner(string memory _name) public onlyOwner {
        require(goalPoolCount < MAX_GOAL_POOLS, "Maximum number of goal pools reached");

        goalPoolCount++;
        goalPools[goalPoolCount] = GoalPool(_name, new uint[](0));

    emit GoalPoolCreated(goalPoolCount, _name);
    }
    // Function to create a new goal with a title, and goal pool ID
    // This function can only be called by the contract owner
