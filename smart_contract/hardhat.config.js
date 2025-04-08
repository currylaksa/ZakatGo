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
  },
};
