//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;
	event Transfer(address from,address receiver,uint amount,string message,uint256 timestamp,string keyword);
    struct TransferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;  
    }
    
    TransferStruct[] transactions;

    function addToBlockchain(address payable receiver,uint amount,string memory message,string memory keyword) public{
         transactionCount+=1;
         transactions.push(TransferStruct(msg.sender,receiver,amount,message,block.timestamp,keyword));
         emit Transfer(msg.sender,receiver,amount,message,block.timestamp,keyword);

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
            if (keccak256(bytes(transactions[i].keyword)) == keccak256(bytes("ZAKAT"))) {
                zakatCount++;
            }
        }
        TransferStruct[] memory zakatTransactions = new TransferStruct[](zakatCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (keccak256(bytes(transactions[i].keyword)) == keccak256(bytes("ZAKAT"))) {
                zakatTransactions[currentIndex] = transactions[i];
                currentIndex++;
            }
        }
        
        return zakatTransactions;
    }
}