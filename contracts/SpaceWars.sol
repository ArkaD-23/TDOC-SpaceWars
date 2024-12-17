// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SpaceWars {
    mapping(address => string) playerName;

    function registerPlayer(string calldata name) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(playerName[msg.sender]).length == 0, "Player already registered");
        playerName[msg.sender] = name;
    }

    function isPlayerRegistered(address player) public view returns (bool) {
        return bytes(playerName[player]).length > 0;
    }

    function getPlayerName() public view returns(string memory) {
        require(bytes(playerName[msg.sender]).length > 0, "Player not registered");
        return playerName[msg.sender];
    }
}
