pragma solidity ^0.4.9;

import "./ERC223ContractReceiver.sol";
import "./ERC223.sol";
import "./ERC20Token.sol";

/**
 * @title ERC232 Token implementation
 * @dev see https://github.com/ethereum/EIPs/issues/223
 * @dev see https://github.com/Dexaran/ERC223-token-standard/tree/Recommended
 */

contract ERC223Token is ERC223 , ERC20Token, ERC223ContractReceiver {
    using SafeMath for uint256;

  mapping(address => uint) balances;
  
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  
  
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
  // Function to access total supply of tokens .
  function totalSupply() constant returns (uint256 _totalSupply) {
      return totalSupply;
  }
  
  
  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint _value, bytes _data, string _custom_fallback) returns (bool success) {
      
    if(isContract(_to)) {
       require(balanceOf(msg.sender) < _value);
        balances[msg.sender] = balanceOf(msg.sender).sub( _value);
        balances[_to] = balanceOf(_to).add(_value);
        ERC223ContractReceiver receiver = ERC223ContractReceiver(_to);
        receiver.call.value(0)(bytes4(sha3(_custom_fallback)), msg.sender, _value, _data);
        Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    else {
        return super.transfer(_to, _value);
    }
}
  

  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint _value, bytes _data) returns (bool success) {
      
    if(isContract(_to)) {
        return transferToContract(_to, _value, _data);
    }
    else {
        return super.transfer(_to, _value);
    }
}
  
  // Standard function transfer similar to ERC20 transfer with no _data .
  // Added due to backwards compatibility reasons .
  function transfer(address _to, uint _value) returns (bool success) {
      
    //standard function transfer similar to ERC20 transfer with no _data
    //added due to backwards compatibility reasons
    bytes memory empty;
    if(isContract(_to)) {
        return transferToContract(_to, _value, empty);
    }
    else {
        return super.transfer(_to, _value);
    }
}

//assemble the given address bytecode. If bytecode exists then the _addr is a contract.
  function isContract(address _addr) private returns (bool is_contract) {
      uint length;
      assembly {
            //retrieve the size of the code on target address, this needs assembly
            length := extcodesize(_addr)
      }
      return (length>0);
    }

  //function that is called when transaction target is a contract
  function transferToContract(address _to, uint _value, bytes _data) private returns (bool success) {
    require(balanceOf(msg.sender) < _value);
    balances[msg.sender] = balanceOf(msg.sender).sub(_value);
    balances[_to] = balanceOf(_to).add(_value);
      ERC223ContractReceiver receiver = ERC223ContractReceiver(_to);
    receiver.tokenFallback(msg.sender, _value, _data);
    Transfer(msg.sender, _to, _value, _data);
    return true;
}

}
