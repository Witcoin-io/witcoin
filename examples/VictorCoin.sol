pragma solidity ^0.4.11;


import "./EasyCoinInterface.sol";


/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract VictorCoin is EasyCoinInterface {

  string public constant name = "VictorCoin";
  string public constant symbol = "VIC";
  uint8 public constant decimals = 8;

  uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function VictorCoin() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

    function saySomething() public constant returns (bytes32) {
        return "VictorCoin is the best!";
    }

}
