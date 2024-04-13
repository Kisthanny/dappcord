// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Dappcord is ERC721 {
    address public owner;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
        address owner;
    }

    mapping(uint256 => Channel) public channels;
    mapping(uint256 => mapping(address => bool)) public hasJoined;
    mapping(uint256 => uint256) public channelBalance;

    uint256 public channelCounter;
    uint256 public nftCounter;

    event ChannelCreated(
        uint256 indexed channelId,
        string name,
        uint256 cost,
        address owner
    );

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function createChannel(
        string memory _name,
        uint256 _cost
    ) public {
        channelCounter++;
        channels[channelCounter] = Channel(
            channelCounter,
            _name,
            _cost,
            msg.sender
        );
        hasJoined[channelCounter][msg.sender] = true;
        channelBalance[channelCounter] = 0;

        emit ChannelCreated(channelCounter, _name, _cost, msg.sender);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0 && _id <= channelCounter, "invalid channelId");
        require(!hasJoined[_id][msg.sender], "already joined");
        require(msg.value >= channels[_id].cost, "insufficient mint fee");

        nftCounter++;
        _safeMint(msg.sender, nftCounter);

        // dispatch access of channel to sender
        hasJoined[_id][msg.sender] = true;
        channelBalance[_id] += msg.value;
    }

    function withdraw(uint256 _id) public payable {
        require(channels[_id].owner == msg.sender, "not the channel owner");
        require(channelBalance[_id] > 0, "empty pool");
        payable(msg.sender).transfer(channelBalance[_id]);
    }
}
