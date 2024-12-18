// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


contract Messenger {
    struct Message {
        address src;
        address dst;
        string message;
    }

    mapping(address => Message[]) public messages;

    function sendMessage(address destination, string calldata message) public {
        messages[msg.sender].push(Message({src: msg.sender, dst: destination, message: message}));
        messages[destination].push(Message({src: msg.sender, dst: destination, message: message}));
    }
    function getMyMessages() public view returns (Message[] memory) {
        return messages[msg.sender];
    }
}