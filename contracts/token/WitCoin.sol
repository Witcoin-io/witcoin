pragma solidity ^0.4.11;


import "./KnowledgeToken.sol";


/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract WitCoin is KnowledgeToken{


    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    function WitCoin() {
        totalSupply = 0;
        name = "Witcoin";
        symbol = "WIT";
        decimals = 8;
       // balances[msg.sender] = INITIAL_SUPPLY;
    }

}
