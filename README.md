# NFT Minter Website

A decentralized NFT minter where users can upload and mint any image as an NFT and view it in their wallet. Built with **Solidity, Hardhat, IPFS, Node.js, Express.js, and React.js**.

## Features
- Upload an image and mint it as an NFT
- NFTs are securely stored on **IPFS**
- Instantly view minted NFTs in your wallet
- Fully decentralized and easy to use

## Tech Stack
- **Smart Contract:** Solidity, Hardhat
- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Storage:** IPFS

## Setup Instructions

### 1. Smart Contract (Hardhat)
#### Install dependencies:
```sh
npm install
```
#### Compile the contract:
```sh
npx hardhat compile
```
#### Deploy the contract to Sepolia network:
```sh
npx hardhat ignition deploy ./ignition/modules/NFT.js --network sepolia
```

### 2. Backend Setup
#### Install dependencies:
```sh
npm install
```
#### Start the backend server:
```sh
node index.js
```

### 3. Frontend Setup
#### Install dependencies:
```sh
npm install
```
#### Run the development server:
```sh
npm run dev
```

## Environment Variables (.env)
Make sure to configure your `.env` file with the required details.

## Contributing
Feel free to open issues or submit pull requests to improve the project.

## License
This project is open-source and available under the MIT License.

---
🔥 **Happy Minting!** 🚀

