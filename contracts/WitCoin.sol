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

    function mint(address _to, uint256 _amount) public returns (bool) {
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Transfer(0x0, _to, _amount);
        return true;
    }

    function transferCheaper(address _from, address _to, uint256 _value)public returns (bool) {
        require(_to != address(0));

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        return true;
    }

    function transferFromMultiple(address _from, address[] _toArray, uint256[] _valueArray) public returns (bool) {
        for (uint i = 0; i < _toArray.length; i++) {
            address _to = _toArray[i];
            balances[_from] = balances[_from].sub(_valueArray[i]);
            balances[_to] = balances[_to].add(_valueArray[i]);
        }
        return true;
    }
}
