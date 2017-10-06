pragma solidity ^0.4.11;

import './ERC20.sol';

/**
 * @title ERC232 interface
 * @dev see https://github.com/ethereum/EIPs/issues/223
 * @dev see https://github.com/Dexaran/ERC223-token-standard/tree/Recommended
 */

contract ERC223 is ERC20 {

    function name() constant returns (string _name);
    function symbol() constant returns (string _symbol);
    function decimals() constant returns (uint8 _decimals);
   // function totalSupply() constant returns (uint256 _supply);

    function transfer(address to, uint256 value, bytes data) returns (bool);
    function transfer(address to, uint256 value, bytes data, string custom_fallback) returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value, bytes indexed data);

}