pragma solidity ^0.4.11;


import "../examples/zeppelin-contracts/token/StandardToken.sol";


/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract WitCoin is StandardToken {

  string public constant name = "WitCoin";
  string public constant symbol = "W";
  uint8 public constant decimals = 8;

  uint256 public constant INITIAL_SUPPLY = 20000 * (10 ** uint256(decimals));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function WitCoin() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}