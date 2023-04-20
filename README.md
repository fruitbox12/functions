# UpGoal 🏁
Accountability Platform

![Jokes Card](https://readme-jokes.vercel.app/api)

## I. Introduction
- A decentralized application (DAPP) to encourage goal achievement through token staking
- Users stake tokens on goals and earn rewards for successful completion

## II. User Interface
- Account creation
- Users create accounts with a wallet address
- Users must have a level of reputation to prevent sybil attacks 

B. Goal Pools
- Create up to "X" goal pools can be created by the contract owner
- Each goal pool contains a list of goals

C. Goals
- Contract owner creates goals with a title and associates them with a goal pool
- Users can suggest and propose goals
- Users can join goals and stake tokens

## III. Smart Contract Functions

- Creates a new user with a user with wallet address
- Checks the user's passport score
- Contract owner creates a new goal pool with a name
- Contract owner creates a new goal with a title and associates it with a goal pool
- Users join a goal and stake tokens
- Transfers tokens from user to contract
- Record user participation in the goal and integrate API for goal data

- Determine how to mark a user as failed for a goal
- Users can claim rewards after completing a goal
- Calculates user's share of rewards from failed users
- Transfers staked tokens and rewards back to the user
