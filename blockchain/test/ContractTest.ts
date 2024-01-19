import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SavingsWallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();
    
    const savingsWallet = await ethers.deployContract("SavingsWallet");

    return { owner, savingsWallet };
  }

  it("should pass", async () => {
    const {owner, savingsWallet} = await deployFixture()
  })
});
