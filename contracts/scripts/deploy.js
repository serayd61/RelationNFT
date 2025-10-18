async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const oracleAddress = process.env.ORACLE_ADDRESS || deployer.address;
  
  const RelationNFT = await ethers.getContractFactory("RelationNFT");
  const contract = await RelationNFT.deploy(oracleAddress);
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("Contract deployed to:", address);
  
  // Save address to .env
  console.log("\nAdd to .env file:");
  console.log("CONTRACT_ADDRESS=" + address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
