// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage,Ownable{
    uint256 public tokenIds;

    constructor() ERC721("Image","IMG") Ownable(msg.sender){
        tokenIds = 0;
    }

    function mintNFT(address to, string memory tokenURI) external onlyOwner returns(uint256) {
         tokenIds++;
         _safeMint(to,tokenIds);
         _setTokenURI(tokenIds,tokenURI);
         return tokenIds;
    }

}

//0x57ab6c15fAeEa0402a1c8Aa8a68703Ded74E3f1B