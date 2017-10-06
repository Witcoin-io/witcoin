pragma solidity ^0.4.0;

import "../dependencies/ownership/Ownable.sol";
import "./ERC223Token.sol";
import "./KnowledgeTokenInterface.sol";

contract KnowledgeToken is KnowledgeTokenInterface ,Ownable,ERC223Token {

    address public minter;
    mapping(address => uint) balances;
    uint256 public totalSupply;

    modifier onlyMinter() {
        // Only minter is allowed to proceed.
        assert (msg.sender != minter);
        _;
    }

    function mint(address _to, uint256 _amount) onlyMinter public returns (bool) {
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Transfer(0x0, _to, _amount);
        Mint(_to, _amount);
        return true;
    }

    function changeMinter(address newAddress) public onlyOwner returns (bool)
    {
        minter = newAddress;
    }
}
