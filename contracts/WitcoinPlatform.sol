pragma solidity ^0.4.11;

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
        Witcoin coin = Witcoin(WitcoinAddress);
        coin.transferFrom(author, msg.sender, 1);
        //paga el reward a les citacions.
        rewardCitations(author,1,4);

    //si tot correcte guardo el registre.
    wits[witaddress] = wit({author:msg.sender, register:register,citations:citations,title:title,description:description });

        AcknowledgementValidation();
        //reparticio de moneda

    }

    function rewardCitations(address author,uint256 amount ,uint level){

        Witcoin coin = Witcoin(WitcoinAddress);
        coin.transferFrom(author, 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3, 1);

        if (level=0){
            return;
        }else{
            for (var i=0;i<4;i++){
            rewardCitations(author,level-1); //send wits
            }
        }
    }

}