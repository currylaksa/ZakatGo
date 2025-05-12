require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/UaEXUwysjx-p2DknLFmvve3bL71in88r",
      accounts: [
        "ba988cc7807b6be4ab7170d45a2423cd044814ea783f85d1e0b04fa6a9563245",
      ],
    },
    swanSaturn: {
      url: "http://185.199.53.44:8545",
      accounts: ["bf4808ae69c6e2d3f025c447b84e918c2f97b2f68ab27bf5b08a31ec4274b138"],
      chainId: 2024
    },
  },
};
