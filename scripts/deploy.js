const hre = require("hardhat");

async function main() {
  const reg = await hre.ethers.deployContract("DocRegistry");
  await reg.waitForDeployment();
  console.log("DocRegistry deployed to:", await reg.getAddress());

  const h = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Laporan asli"));
  const tx = await reg.register(h);
  const receipt = await tx.wait();
  console.log("tx hash:", tx.hash, "| block:", receipt.blockNumber);

  const [ok, who] = await reg.verify(h);
  console.log("verify:", ok, "| owner:", who);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });