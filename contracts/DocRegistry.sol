// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DocRegistry {
    struct Record { address owner; uint256 timestamp; }
    mapping(bytes32 => Record) public records;

    event Registered(bytes32 indexed docHash, address indexed owner, uint256 timestamp);

    event Revoked(bytes32 indexed docHash);

    function revoke(bytes32 docHash) external {
        require(records[docHash].owner == msg.sender, "Not owner");
        delete records[docHash];
        emit Revoked(docHash);
    }

    function register(bytes32 docHash) external {
        require(records[docHash].owner == address(0), "Already registered");
        records[docHash] = Record(msg.sender, block.timestamp);
        emit Registered(docHash, msg.sender, block.timestamp);
    }

    function verify(bytes32 docHash) external view returns (bool, address, uint256) {
        Record memory r = records[docHash];
        return (r.owner != address(0), r.owner, r.timestamp);
    }
}