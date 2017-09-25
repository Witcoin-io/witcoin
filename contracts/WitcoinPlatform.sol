pragma solidity ^0.4.11;

import "./AdriCoin.sol";

contract RegisterWit {


address WitcoinAddress;

    struct wit {
    address author;
    address register;
    address[4] citations;
    string title;
    string description;
    uint256 reputation;
    }

    mapping (address => wit) wits;

    function RegisterWit(address a) {
        WitcoinAddress = a;

}

    function AcknowledgementValidation(){
        //victor stuff;
    }

    function Register(address witaddress,address author, address[4] citations,string title,string description,uint256 fee, uint witcoins ) {

        //paga taxa registra al registrador.
        AdriCoin coin = AdriCoin(WitcoinAddress);
        coin.transferFrom(author, msg.sender, 1);
        //paga el reward a les citacions.
        rewardCitations(author,1,4);

    //si tot correcte guardo el registre.
    wits[witaddress] = wit({author:author, register:msg.sender,citations:citations,title:title,description:description,reputation:0 });

        AcknowledgementValidation();
        //reparticio de moneda

    }

    function rewardCitations(address author,uint256 amount ,uint level){

        AdriCoin coin = AdriCoin(WitcoinAddress);
        coin.transferFrom(author, 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3, 1);

        if (level==0){
            return;
        }else{
            for (uint i=0;i<4;i++){
            rewardCitations(author,1,level-1); //send wits
            }
        }
    }

}