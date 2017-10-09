pragma solidity ^0.4.15;


import "./token/ERC223ReceivingContract.sol";


contract SampleContract is ERC223ReceivingContract {

    uint256 public received;
    address public sender;

    function SampleContract() {
        received = 0;
        sender = 0x0;
    }

    function tokenFallback(address _from, uint256 _value, bytes _data) {
        sender = _from;
    }
}
