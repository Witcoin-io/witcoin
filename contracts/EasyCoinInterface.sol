pragma solidity ^0.4.11;

import "./dependencies/token/StandardToken.sol";

contract EasyCoinInterface is StandardToken {

    function saySomething() public constant returns (bytes32);

}
