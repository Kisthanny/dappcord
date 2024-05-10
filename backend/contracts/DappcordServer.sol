// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract DappcordServer is ERC721 {
    enum ChannelType {
        TEXT,
        VOICE
    }

    struct Channel {
        uint256 channelId;
        string channelName;
        string channelTopic;
        ChannelType channelType;
        uint256 channelFee;
        uint256 categoryId;
        address[] memberList;
    }

    struct Category {
        uint256 categoryId;
        string categoryName;
        uint256[] channelIdList;
    }

    address public owner;

    uint256 private categoryCounter = 10000;
    uint256 private channelCounter = 10000;
    uint256 private tokenIdCounter = 10000;

    uint256[] categoryIdList;

    mapping(uint => Category) public categoryMapping;
    mapping(uint => Channel) public channelMapping;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    event ChannelCreated(uint256 channelId);

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function getCategoryIdList() public view returns (uint256[] memory) {
        return categoryIdList;
    }

    function getChannelIdList(
        uint256 _categoryId
    ) public view returns (uint256[] memory) {
        return categoryMapping[_categoryId].channelIdList;
    }

    function getMemberList(
        uint256 _channelId
    ) public view returns (address[] memory) {
        return channelMapping[_channelId].memberList;
    }

    function getlatestChannelId() public view returns (uint256) {
        return channelCounter;
    }

    function hasCategory(uint256 _categoryId) private view returns (bool) {
        if (categoryMapping[_categoryId].categoryId > 10000) {
            return true;
        }
        return false;
    }

    function createChannel(
        string memory _channelName,
        string memory _channelTopic,
        ChannelType _channelType,
        uint256 _channelFee,
        uint256 _categoryId
    ) public onlyOwner {
        require(hasCategory(_categoryId), "Category does not exist");
        // create the channel in memory
        channelCounter++;
        address[] memory memberList;
        Channel memory channel = Channel(
            channelCounter,
            _channelName,
            _channelTopic,
            _channelType,
            _channelFee,
            _categoryId,
            memberList
        );

        // save the channel in storage mapping
        channelMapping[channelCounter] = channel;

        // connect to the category
        categoryMapping[_categoryId].channelIdList.push(channelCounter);

        emit ChannelCreated(channelCounter);
    }

    function createCategory(string memory _categoryName) public onlyOwner {
        categoryCounter++;
        uint256[] memory channelIdList;
        Category memory category = Category(
            categoryCounter,
            _categoryName,
            channelIdList
        );
        categoryIdList.push(categoryCounter);
        categoryMapping[categoryCounter] = category;
    }

    function editCategoryName(
        uint256 _categoryId,
        string memory _categoryName
    ) public onlyOwner {
        categoryMapping[_categoryId].categoryName = _categoryName;
    }

    function editChannelName(
        uint256 _channelId,
        string memory _channelName
    ) public onlyOwner {
        channelMapping[_channelId].channelName = _channelName;
    }
    function editChannelTopic(
        uint256 _channelId,
        string memory _channelTopic
    ) public onlyOwner {
        channelMapping[_channelId].channelTopic = _channelTopic;
    }

    function hasJoined(
        uint256 _channelId,
        address _member
    ) public view returns (bool) {
        Channel memory channel = channelMapping[_channelId];
        address[] memory memberList = channel.memberList;
        for (uint256 i = 0; i < memberList.length; i++) {
            if (memberList[i] == _member) {
                return true;
            }
        }
        return false;
    }

    function joinChannel(uint256 _channelId) public payable {
        Channel storage channel = channelMapping[_channelId];
        require(channel.channelId > 10000, "Channel does not exist");
        require(msg.value >= channel.channelFee, "Insufficient Fee");
        require(!hasJoined(_channelId, msg.sender), "Already Joined");

        tokenIdCounter++;
        _safeMint(msg.sender, tokenIdCounter);

        channel.memberList.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Server balance is zero");
        payable(owner).transfer(balance);
    }
}
