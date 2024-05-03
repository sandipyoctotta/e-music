// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MeMusic is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MeMusic", "MNFT") Ownable() {}

    /**
     * @dev Mint a new NFT linked to a music file on IPFS.
     * @param recipient The address of the recipient who will receive the NFT.
     * @param metadataURI The URI of the JSON metadata on IPFS.
     * @return The new token ID
     */
    function mintNFT(
        address recipient,
        string memory metadataURI
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }
}
