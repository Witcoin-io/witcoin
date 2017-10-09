pragma solidity ^0.4.15;

import "./token/KnowledgeToken.sol";

contract WitCoin is KnowledgeToken{

    function WitCoin() {
        totalSupply = 0;
        name = "Witcoin";
        symbol = "WIT";
        decimals = 8;
    }

}
