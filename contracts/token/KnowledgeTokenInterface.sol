pragma solidity ^0.4.15;

import './ERC223.sol';

contract KnowledgeTokenInterface is ERC223{

    address public minter;

    event Mint(address indexed to, uint256 amount);

    function changeMinter(address newAddress) returns (bool);
    function mint(address _to, uint256 _amount) returns (bool);
}
