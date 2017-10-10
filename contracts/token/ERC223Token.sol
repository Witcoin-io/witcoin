pragma solidity ^0.4.9;


import "./ERC223ReceivingContract.sol";
import "./ERC223.sol";
import "./ERC20Token.sol";


/**
 * @title ERC232 Token implementation
 * @dev see https://github.com/ethereum/EIPs/issues/223
 * @dev see https://github.com/Dexaran/ERC223-token-standard/tree/Recommended
 */

contract ERC223Token is ERC223, ERC20Token {
    using SafeMath for uint256;

    string public name;

    string public symbol;

    uint8 public decimals;


    // Function to access name of token .
    function name() constant returns (string _name) {
        return name;
    }
    // Function to access symbol of token .
    function symbol() constant returns (string _symbol) {
        return symbol;
    }
    // Function to access decimals of token .
    function decimals() constant returns (uint8 _decimals) {
        return decimals;
    }

    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address _to, uint256 _value, bytes _data) returns (bool success) {
        if (isContract(_to)) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        return super.transfer(_to, _value);
    }

    // Standard function transfer similar to ERC20 transfer with no _data .
    // Added due to backwards compatibility reasons .
    function transfer(address _to, uint256 _value) returns (bool success) {
        if (isContract(_to)) {
            bytes memory empty;
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        return super.transfer(_to, _value);
    }

    //assemble the given address bytecode. If bytecode exists then the _addr is a contract.
    function isContract(address _addr) private returns (bool is_contract) {
        uint length;
        assembly {
            length := extcodesize(_addr)
        }
        return (length > 0);
    }

}