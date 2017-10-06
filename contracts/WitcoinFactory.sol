pragma solidity ^0.4.15;

import "./token/WitCoin.sol";
import "./WitcoinSupplyInterface.sol";
import "./WitKnowledgeInterface.sol";

contract WitcoinFactory {

    address WitcoinPlatform;

    event WitCreated(string txt, address value);

    function WitcoinFactory(address p) {
        WitcoinPlatform = p;
    }

    modifier onlyWitcoinPlatform {
        require(msg.sender == WitcoinPlatform);
        _;
    }

    function CreateWit(address author, address[] citations) returns(address) {
        WitKnowledge wit = new WitKnowledge(author, citations);
        WitCreated("address", wit);
        return wit;
    }

    function CreateWit1(address author, address c1, address c2, address c3, address c4) returns(address) {
        address[] memory cited = new address[](4);
        if (c1 != 0x0) cited[0] = c1;
        if (c2 != 0x0) cited[1] = c2;
        if (c3 != 0x0) cited[2] = c3;
        if (c4 != 0x0) cited[3] = c4;
        WitKnowledge wit = new WitKnowledge(author, cited);
        WitCreated("address", wit);
        return wit;
    }

}

contract WitKnowledge is WitKnowledgeInterface {

    modifier onlyAuthor {
        require(msg.sender == author);
        _;
    }

    function WitKnowledge(address a, address[] c){
        author = a;
        citations = c;
    }

    function withdrawWitcoins() onlyAuthor {

    }

    function getAuthorAddress() returns(address) {
        return author;
    }

}