pragma solidity ^0.4.15;

import "../util/Ownable.sol";
import "./ERC223Token.sol";
import "./KnowledgeTokenInterface.sol";

contract KnowledgeToken is KnowledgeTokenInterface, Ownable, ERC223Token {

    address public minter;

    modifier onlyMinter() {
        // Only minter is allowed to proceed.
        require (msg.sender == minter);
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
