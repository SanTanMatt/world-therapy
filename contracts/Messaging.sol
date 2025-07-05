// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Messaging {
    struct Message {
        address from;
        address to;
        string content;
        uint256 timestamp;
        bool read;
    }

    // Mapping from user address to their messages
    mapping(address => Message[]) private inbox;
    
    // Event emitted when a message is sent
    event MessageSent(address indexed from, address indexed to, uint256 timestamp);
    
    // Send a message to another address
    function sendMessage(address _to, string memory _content) public {
        require(_to != address(0), "Cannot send to zero address");
        require(bytes(_content).length > 0, "Message cannot be empty");
        
        Message memory newMessage = Message({
            from: msg.sender,
            to: _to,
            content: _content,
            timestamp: block.timestamp,
            read: false
        });
        
        // Add to recipient's inbox
        inbox[_to].push(newMessage);
        
        // Also keep a copy in sender's sent messages
        inbox[msg.sender].push(newMessage);
        
        emit MessageSent(msg.sender, _to, block.timestamp);
    }
    
    // Get all messages for the caller
    function getMyMessages() public view returns (Message[] memory) {
        return inbox[msg.sender];
    }
    
    // Get conversation between caller and another address
    function getConversation(address _otherAddress) public view returns (Message[] memory) {
        Message[] memory myMessages = inbox[msg.sender];
        uint256 count = 0;
        
        // First, count relevant messages
        for (uint i = 0; i < myMessages.length; i++) {
            if (myMessages[i].from == _otherAddress || myMessages[i].to == _otherAddress) {
                count++;
            }
        }
        
        // Create array of correct size
        Message[] memory conversation = new Message[](count);
        uint256 index = 0;
        
        // Fill conversation array
        for (uint i = 0; i < myMessages.length; i++) {
            if (myMessages[i].from == _otherAddress || myMessages[i].to == _otherAddress) {
                conversation[index] = myMessages[i];
                index++;
            }
        }
        
        return conversation;
    }
    
    // Mark a message as read
    function markAsRead(uint256 _messageIndex) public {
        require(_messageIndex < inbox[msg.sender].length, "Invalid message index");
        inbox[msg.sender][_messageIndex].read = true;
    }
    
    // Get number of unread messages
    function getUnreadCount() public view returns (uint256) {
        uint256 unreadCount = 0;
        Message[] memory myMessages = inbox[msg.sender];
        
        for (uint i = 0; i < myMessages.length; i++) {
            if (!myMessages[i].read && myMessages[i].to == msg.sender) {
                unreadCount++;
            }
        }
        
        return unreadCount;
    }
}