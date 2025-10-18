async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Oracle address - deployer wallet adresinizi kullan
  const oracleAddress = deployer.address;
  
  const RelationNFT = await ethers.getContractFactory("RelationNFT");
  const contract = await RelationNFT.deploy(oracleAddress);
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log("Contract deployed to:", address);
  console.log("Oracle address:", oracleAddress);
  
  console.log("\n📝 Add to .env file:");
  console.log("CONTRACT_ADDRESS=" + address);
  console.log("ORACLE_ADDRESS=" + oracleAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});