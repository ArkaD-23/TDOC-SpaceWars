// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

struct Token {
    uint256 tokenId;
    uint256 price;
    address payable seller;
}

contract NFT_MarketPlace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    constructor() ERC721("GameItem", "ITM") {}
    mapping(uint256 => Token) private _item;
    mapping(address => uint256[]) private ownedNFTs;

    Token[] private _items;

    function createNFT(string calldata tokenURI) public {
        _tokenIDs.increment();
        uint256 currentID = _tokenIDs.current();
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);
        ownedNFTs[msg.sender].push(_tokenIDs.current());
    }

    function getOwnedNFTs() public view returns (uint256[] memory) {
        return ownedNFTs[msg.sender];
    }

    function getListedNFTs() public view returns (Token[] memory) {
        return _items;
    }

    function listNFT(uint256 tokenID, uint256 price) public {
        require(price > 0, "NFTMarket: price must be greater than 0");
        require(
            ownerOf(tokenID) == msg.sender,
            "NFTMarket: You are not the owner"
        );

        transferFrom(msg.sender, address(this), tokenID);

        _item[tokenID] = Token({
            tokenId: tokenID,
            price: price,
            seller: payable(msg.sender)
        });
        _items.push(_item[tokenID]);

        // Removing from Owned NFTs
        for (uint256 i = 0; i < ownedNFTs[msg.sender].length; i++) {
            if (ownedNFTs[msg.sender][i] == tokenID) {
                ownedNFTs[msg.sender][i] = ownedNFTs[msg.sender][
                    ownedNFTs[msg.sender].length - 1
                ];
                ownedNFTs[msg.sender].pop();
                break;
            }
        }
    }

    function buyNFT(uint256 tokenID) public payable returns (bool) {
        require(_item[tokenID].price > 0, "NFTMarket: Item is not for sale");
        require(
            msg.value == _item[tokenID].price,
            "NFTMarket: Not sufficient money transferred"
        );

        // NFT Transfer
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenID);
        ownedNFTs[msg.sender].push(tokenID);

        // Ether Transfer
        (bool success, ) = _item[tokenID].seller.call{value: msg.value}("");

        // Clear Item
        _item[tokenID] = Token({
            tokenId: tokenID,
            price: 0,
            seller: payable(address(0))
        });
        for (uint256 i = 0; i < _items.length; i++) {
            if (_items[i].tokenId == tokenID) {
                _items[i] = _items[_items.length - 1];
                _items.pop();
                break;
            }
        }

        return success;
    }
}
