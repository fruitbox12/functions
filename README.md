# UpGoaled 🏁
An accountability platform; reach your goals and take responsibility for your progress.

![Jokes Card](https://readme-jokes.vercel.app/api)

## introduction  
UpGoaled is decentralized web application designed to offer a transparent and secure environment for goal tracking and accomplishment verification. The platform incorporates tokenized rewards to encourage users to remain committed to their goals, fostering a sense of community through shared incentives.

## Key Features
1. User Management: Users can create an account and manage their personal goals.

2. Goal Creation and Management: Users can create goals, track progress. 

3. Staking: Users can pledge funds towards their goals as a commitment. If they complete the goal, they will get their pledged funds back. If they fail to complete the goal, they will not receive the funds they staked.

4. Goal Pools: Users will be able to select from diffrent pools to which they can allocate their pledged funds. This allows for better organization and management of the user's goals and funds.

5. Community Participation: Users can join a community of other users who share the same goals, fostering a sense of camaraderie and mutual support.

6. Transparent and Secure: The platform is built using smart contracts on the Ethereum blockchain, ensuring transparency and security in all transactions.

7. Web3 Integration: The platform seamlessly works with Web3 wallets such as MetaMask, allowing users to securely sign transactions and interact with the app using their wallet.

# Tech Stack

- Smart Contracts: Solidity (Ethereum) - or EVM compatible blockchains
- Backend: Node.js 
- Frontend: React/javascript
- Database: 
- Web3 Wallet Integration: MetaMask

- Creates a new user with a user with wallet address
- Contract owner creates a new goal pool with a name
- Contract owner creates a new goal with a title and associates it with a goal pool
- Users join a goal and stake tokens
- Transfers tokens from user to contract
- Record user participation in the goal and integrate API for goal data

- Determine how to mark a user as failed for a goal
- Users can claim rewards after completing a goal
- Calculates user's share of rewards from failed users
- Transfers staked tokens and rewards back to the user
