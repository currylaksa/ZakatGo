const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();
  await transactions.waitForDeployment();

  const address = await transactions.getAddress();
  console.log("Transactions deployed to:", address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("Error in deployment:", error);
    process.exit(1);
  }
};

runMain();
