// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SavingsWalletFactory {
    event WalletCreated(address indexed owner, address walletAddress);
    mapping (address => address) public ownersToWallets; // address pointing to wallets also, you can only have 1 savings wallet
    address admin;

    constructor () {
        admin = msg.sender;
    }

    function createSavingsWallet(uint256 withdrawalDay) external returns (address) {
        require(ownersToWallets[msg.sender] == address(0), "You already have a savings wallet");
        address newWallet = address(new SavingsWallet(msg.sender, admin, withdrawalDay));
        ownersToWallets[msg.sender] = newWallet;
        emit WalletCreated(msg.sender, newWallet);
        return newWallet;
    }
}

contract SavingsWallet {
    address public owner;
    address public admin;
    uint256 public withdrawalDaysInterval; // number of days between withdrawals
    uint256 public lastWithdrawalTimestamp;
    uint256 nextWithdrawalTimestamp;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    modifier onlyDuringWithdrawalPeriod() {
        require(
            block.timestamp >= lastWithdrawalTimestamp && block.timestamp > getNextWithdrawalTimestamp(),
            "Withdrawal not allowed at this time"
        );
        _;
    }

    constructor(address _owner, address _admin, uint256 _withdrawalDaysInterval) {
        owner = _owner;
        admin = _admin;
        withdrawalDaysInterval = _withdrawalDaysInterval;
        lastWithdrawalTimestamp = block.timestamp;
        nextWithdrawalTimestamp = lastWithdrawalTimestamp + (_withdrawalDaysInterval * 1 days);
    }

    function deposit() external payable onlyOwner {
        // Deposit funds into the wallet
    }

    function withdraw() external onlyOwner onlyDuringWithdrawalPeriod {
        // Perform withdrawal
        
        payable(owner).transfer(address(this).balance);
        lastWithdrawalTimestamp = block.timestamp;
        nextWithdrawalTimestamp = lastWithdrawalTimestamp + (withdrawalDaysInterval * 1 days);
    }

    function getNextWithdrawalTimestamp() public view returns (uint256) {
        return nextWithdrawalTimestamp;
    }

    function instantWithdraw() onlyAdmin external {
        nextWithdrawalTimestamp = block.timestamp;
    }

    receive() external payable {
        // Fallback function to receive ether
    }
}
