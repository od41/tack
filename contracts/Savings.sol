// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SavingsWalletFactory {
    event WalletCreated(address indexed owner, address walletAddress);
    mapping (address => address) public ownersToWallets; // address pointing to wallets also, you can only have 1 savings wallet

    function createSavingsWallet(uint256 withdrawalDay) external returns (address) {
        require(ownersToWallets[msg.sender] == address(0), "You already have a savings wallet");
        address newWallet = address(new SavingsWallet(msg.sender, withdrawalDay));
        ownersToWallets[msg.sender] = newWallet;
        emit WalletCreated(msg.sender, newWallet);
        return newWallet;
    }
}

contract SavingsWallet {
    address public owner;
    uint256 public withdrawalDaysInterval; // number of days between withdrawals
    uint256 public lastWithdrawalTimestamp;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyDuringWithdrawalPeriod() {
        require(
            block.timestamp >= lastWithdrawalTimestamp && block.timestamp < getNextWithdrawalTimestamp(),
            "Withdrawal not allowed at this time"
        );
        _;
    }

    constructor(address _owner, uint256 _withdrawalDaysInterval) {
        owner = _owner;
        withdrawalDaysInterval = _withdrawalDaysInterval;
        lastWithdrawalTimestamp = block.timestamp;
    }

    function deposit() external payable onlyOwner {
        // Deposit funds into the wallet
    }

    function withdraw() external onlyOwner onlyDuringWithdrawalPeriod {
        // Perform withdrawal logic
        // For example, transfer funds to the owner
        payable(owner).transfer(address(this).balance);
        lastWithdrawalTimestamp = block.timestamp;
    }

    function getNextWithdrawalTimestamp() public view returns (uint256) {
        uint256 daysInSeconds = withdrawalDaysInterval * 24 * 60 * 60;
        return lastWithdrawalTimestamp + daysInSeconds;
    }

    receive() external payable {
        // Fallback function to receive ether
    }
}
