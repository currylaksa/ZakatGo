//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol"; // Optional: For debugging during development

contract Transactions {
    uint256 transactionCount;
    // Define the fixed receiver address - MAKE SURE THIS IS YOUR INTENDED FINAL RECIPIENT
    address payable public constant FIXED_RECEIVER = payable(0x227fff9c413Ff12fB82448e75B37876B584186FC); 

	event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
    
    struct TransferStruct{
        address sender;     // The original msg.sender who initiated the transaction
        address receiver;   // This will always be FIXED_RECEIVER for the actual fund transfer
        uint amount;        // The amount specified for the Zakat/transaction logic
        string message;
        uint256 timestamp;
        string keyword;  
    }
    
    TransferStruct[] transactions;

    // The 'frontendReceiverInput' is the address provided by the frontend (e.g., from formData.addressTo).
    // While the actual sETH transfer will go to FIXED_RECEIVER, 
    // 'frontendReceiverInput' can be stored for informational purposes if needed, or ignored.
    // For simplicity and to ensure funds always go to FIXED_RECEIVER, we will record FIXED_RECEIVER in the struct.
    function addToBlockchain(address payable /* frontendReceiverInput */, uint amount, string memory message, string memory keyword) public payable {
         // Ensure the value sent with the transaction (msg.value) is at least the 'amount' specified for the Zakat logic.
         // It's common to require msg.value == amount, but >= allows for overpayment if desired (though usually not for Zakat).
         require(msg.value >= amount, "Not enough sETH sent to cover the transaction amount");

         // Forward the actual sETH received (msg.value) to the FIXED_RECEIVER address
         (bool success, ) = FIXED_RECEIVER.call{value: msg.value}("");
         require(success, "Failed to forward sETH to fixed receiver");
        
         transactionCount += 1;
         // Store FIXED_RECEIVER as the receiver in the transaction log, as that's where the funds went.
         // msg.sender is the original initiator.
         transactions.push(TransferStruct(msg.sender, FIXED_RECEIVER, amount, message, block.timestamp, keyword));
         
         // Emit event showing msg.sender as 'from' and FIXED_RECEIVER as 'to' for the fund movement.
         emit Transfer(msg.sender, FIXED_RECEIVER, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory){
        return transactions;
    }

    function getAllTransactionCount() public view returns (uint256){
        return transactionCount;
    }

    function getZakatTransactions() public view returns (TransferStruct[] memory) {
        uint256 zakatCount = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            // Ensure case-insensitive comparison or consistent casing for "ZAKAT"
            if (keccak256(bytes(transactions[i].keyword)) == keccak256(bytes("ZAKAT")) || keccak256(bytes(transactions[i].keyword)) == keccak256(bytes("zakat"))) {
                zakatCount++;
            }
        }
        
        TransferStruct[] memory zakatTransactionsArray = new TransferStruct[](zakatCount); // Renamed to avoid conflict
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (keccak256(bytes(transactions[i].keyword)) == keccak256(bytes("ZAKAT")) || keccak256(bytes(transactions[i].keyword)) == keccak256(bytes("zakat"))) {
                zakatTransactionsArray[currentIndex] = transactions[i];
                currentIndex++;
            }
        }
        
        return zakatTransactionsArray;
    }

    // Fallback receive function: if sETH is sent directly to the contract without calling a function,
    // it will be accepted and forwarded to the FIXED_RECEIVER.
    receive() external payable {
        console.log("Receive function called, forwarding sETH to FIXED_RECEIVER");
        (bool success, ) = FIXED_RECEIVER.call{value: msg.value}("");
        require(success, "Failed to forward sETH from receive() function");
    }

    // Fallback function: if someone calls a non-existent function.
    // It's generally good practice to have one, though not strictly necessary for this fix.
    // If it's made payable, it could also forward funds, but receive() handles direct transfers.
    fallback() external payable {
        console.log("Fallback function called");
        // If you want the fallback to also forward funds:
        // (bool success, ) = FIXED_RECEIVER.call{value: msg.value}("");
        // require(success, "Failed to forward sETH from fallback() function");
    }
}