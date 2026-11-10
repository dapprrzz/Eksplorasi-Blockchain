const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocRegistry", function () {
  let reg, owner, other;
  const h1 = ethers.keccak256(ethers.toUtf8Bytes("Laporan asli"));
  const h2 = ethers.keccak256(ethers.toUtf8Bytes("Laporan asli (diubah)"));

  beforeEach(async () => {
    [owner, other] = await ethers.getSigners();
    reg = await (await ethers.getContractFactory("DocRegistry")).deploy();
  });

  it("Skenario 1: registrasi hash berhasil", async () => {
    await expect(reg.register(h1)).to.emit(reg, "Registered");
    const [ok, who] = await reg.verify(h1);
    expect(ok).to.equal(true);
    expect(who).to.equal(owner.address);
  });

  it("Skenario 2 (GAGAL): registrasi duplikat ditolak", async () => {
    await reg.register(h1);
    await expect(reg.connect(other).register(h1)).to.be.revertedWith("Already registered");
  });

  it("Skenario 3: dokumen yang dimodifikasi tidak lolos verifikasi", async () => {
    await reg.register(h1);
    const [ok] = await reg.verify(h2);
    expect(ok).to.equal(false);
  });
    it("Modifikasi: owner dapat revoke", async () => {
    await reg.register(h1);
    await expect(reg.revoke(h1)).to.emit(reg, "Revoked");
    const [ok] = await reg.verify(h1);
    expect(ok).to.equal(false);
  });

  it("Modifikasi (GAGAL): non-owner ditolak revoke", async () => {
    await reg.register(h1);
    await expect(reg.connect(other).revoke(h1)).to.be.revertedWith("Not owner");
  });
});
