// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleDEX - Decentralized Exchange for BDAG Tokens
 */
contract SimpleDEX is Ownable, ReentrancyGuard {

    IERC20 public bdagToken;

    // Configuration
    uint256 public swapFee = 10; // 0.1% (basis points)
    address public feeReceiver;

    // Statistics
    uint256 public totalSwaps;
    uint256 public totalVolume;
    uint256 public totalFees;

    // Events
    event SwapExecuted(
        address indexed user,
        address indexed recipient,
        uint256 amountIn,
        uint256 amountOut,
        uint256 feeAmount,
        uint256 timestamp
    );

    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeReceiverUpdated(address oldReceiver, address newReceiver);
    event TokensWithdrawn(address token, uint256 amount);
    event EmergencyWithdraw(address token, uint256 amount);

    constructor(address _bdagTokenAddress) Ownable(msg.sender) {
        require(_bdagTokenAddress != address(0), "Invalid token address");
        bdagToken = IERC20(_bdagTokenAddress);
        feeReceiver = 0xAd0d90cfcFcE095c0f706e013e7086a04657c053;
    }

    /* -------------------------------------------------- */
    /*                    SWAP LOGIC                      */
    /* -------------------------------------------------- */

    function swapBDAG(uint256 amount, address recipient)
        external
        nonReentrant
        returns (bool)
    {
        require(amount > 0, "Amount must be > 0");
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot send to self");
        require(recipient != address(this), "Invalid recipient");

        require(
            bdagToken.balanceOf(msg.sender) >= amount,
            "Insufficient balance"
        );

        require(
            bdagToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );

        uint256 feeAmount = (amount * swapFee) / 10_000;
        uint256 amountAfterFee = amount - feeAmount;

        require(
            bdagToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        if (feeAmount > 0) {
            totalFees += feeAmount;
            require(
                bdagToken.transfer(feeReceiver, feeAmount),
                "Fee transfer failed"
            );
        }

        require(
            bdagToken.transfer(recipient, amountAfterFee),
            "Recipient transfer failed"
        );

        totalSwaps += 1;
        totalVolume += amount;

        emit SwapExecuted(
            msg.sender,
            recipient,
            amount,
            amountAfterFee,
            feeAmount,
            block.timestamp
        );

        return true;
    }

    function bulkSwapBDAG(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant returns (bool) {
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length > 0 && recipients.length <= 50, "Invalid batch");

        uint256 totalAmount;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(totalAmount > 0, "Total amount is zero");

        require(
            bdagToken.balanceOf(msg.sender) >= totalAmount,
            "Insufficient balance"
        );

        require(
            bdagToken.allowance(msg.sender, address(this)) >= totalAmount,
            "Insufficient allowance"
        );

        uint256 totalFee = (totalAmount * swapFee) / 10_000;
        uint256 distributable = totalAmount - totalFee;

        require(
            bdagToken.transferFrom(msg.sender, address(this), totalAmount),
            "Transfer failed"
        );

        if (totalFee > 0) {
            totalFees += totalFee;
            require(
                bdagToken.transfer(feeReceiver, totalFee),
                "Fee transfer failed"
            );
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(recipients[i] != msg.sender, "Cannot send to self");

            uint256 share = (amounts[i] * distributable) / totalAmount;
            if (share > 0) {
                require(
                    bdagToken.transfer(recipients[i], share),
                    "Recipient transfer failed"
                );
            }

            emit SwapExecuted(
                msg.sender,
                recipients[i],
                amounts[i],
                share,
                (amounts[i] * swapFee) / 10_000,
                block.timestamp
            );
        }

        totalSwaps += recipients.length;
        totalVolume += totalAmount;

        return true;
    }

    /* -------------------------------------------------- */
    /*                  VIEW FUNCTIONS                   */
    /* -------------------------------------------------- */

    function getSwapQuote(uint256 amount)
        external
        view
        returns (uint256 netAmount, uint256 fee)
    {
        fee = (amount * swapFee) / 10_000;
        netAmount = amount - fee;
    }

    function getStats()
        external
        view
        returns (uint256 swaps, uint256 volume, uint256 fees, uint256 balance)
    {
        return (
            totalSwaps,
            totalVolume,
            totalFees,
            bdagToken.balanceOf(address(this))
        );
    }

    /* -------------------------------------------------- */
    /*                 ADMIN FUNCTIONS                   */
    /* -------------------------------------------------- */

    function updateSwapFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Max 1%");
        emit FeeUpdated(swapFee, newFee);
        swapFee = newFee;
    }

    function updateFeeReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "Invalid address");
        emit FeeReceiverUpdated(feeReceiver, newReceiver);
        feeReceiver = newReceiver;
    }

    function updateBDAGToken(address newToken) external onlyOwner {
        require(newToken != address(0), "Invalid token");
        bdagToken = IERC20(newToken);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");
        IERC20(token).transfer(owner(), amount);
        emit TokensWithdrawn(token, amount);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = bdagToken.balanceOf(address(this));
        require(balance > 0, "No tokens");
        bdagToken.transfer(owner(), balance);
        emit EmergencyWithdraw(address(bdagToken), balance);
    }

    receive() external payable {}

    function withdrawNative() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
