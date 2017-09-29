pragma solidity 0.4.15;

contract WitKnowledgeInterface {

    address author;
    address[] citations;
    uint256 reputation;

    function withdrawWitcoins() ;

    function getAuthorAddress() returns(address);

}