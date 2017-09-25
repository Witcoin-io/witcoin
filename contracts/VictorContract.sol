pragma solidity ^0.4.0;
contract Token {
  /// total amount of tokens
  uint256 public totalSupply;

  /// @param _owner The address from which the balance will be retrieved
  /// @return The balance
  function balanceOf(address _owner) constant returns (uint256 balance);

  /// @notice send `_value` token to `_to` from `msg.sender`
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transfer(address _to, uint256 _value) returns (bool success);

  /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
  /// @param _from The address of the sender
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transferFrom(address _from, address _to, uint256 _value) returns (bool success);

  /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @param _value The amount of tokens to be approved for transfer
  /// @return Whether the approval was successful or not
  function approve(address _spender, uint256 _value) returns (bool success);

  /// @param _owner The address of the account owning tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens allowed to spent
  function allowance(address _owner, address _spender) constant returns (uint256 remaining);

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract Witcoin is Token {

  string public name = "Witcoin";
  string public symbol = "WIT";
  uint public decimals = 10;
  uint256 public INITIAL_SUPPLY = 8000000;
  uint256 totalSupply;
  int n = 0;

  mapping(address => uint256) balances;
  mapping(string => Wit) registry;

  event WitsReceived(address from, int value);

  struct Wit {
    address owner;
    string witHash;
    address witAddress;
    string[] cites;
    bool exists;
  }

  function transferWits(address from, address to, uint wits) {
    balances[from] -= wits;
    balances[to] += wits;
  }

  function register(string x, string[] cited, uint n) {
    if(registry[x].exists) revert;

    registry[x] = Wit(msg.sender, x, bytesToAddress(stringToBytes32(x)), cited, true);
    transferWits(msg.sender, registry[x].witAddress, 10);

    for (uint ii=0;ii<n;ii++) {
      if (registry[cited[ii]].exists) {
        transferWits(msg.sender, registry[cited[ii]].witAddress, 1);
      }
    }

    mint();
  }

  function mint() {
    address payingAccount = msg.sender;
    int c = 10 ** 9;
    int kn = n/c;
    int generatedWitcoins = 1/log(kn);
    n = n+1;
    supply(generatedWitcoins);
  }

  function supply(int witcoins) {
    uint f1 = 10;
    uint f2 = 40;
    uint f3 = 40;
    uint f4 = 10;

    uint q1 = witcoins*f1/100;
    uint q2 = witcoins*f2/100;
    uint q3 = witcoins*f3/100;
    uint q4 = witcoins-q1-q2-q3;

    // Miner reward
    address miner = block.coinbase;
    supplyWitcoins(miner, q1);

    // Community reward
    address witcoinclub = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
    supplyWitcoins(witcoinclub, q2);

    // Registrars reward
    supplyRegistrars(q3);

    // Dividends
    supplyDividends(q4);
  }

  function supplyWitcoins(address to, int amount) {
    balances[to] = balances[to].add(amount);

    WitsReceived(to, amount);
  }

  function supplyRegistrars(int amount) {
    address registrar = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
    supplyWitcoins(registrar, amount);
  }

  function supplyDividends(int amount) {
    address witsowner = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;
    supplyWitcoins(witsowner, amount);
  }

  function Witcoin() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

  function stringToBytes32(string memory source) returns (bytes result) {
    assembly {
    result := mload(add(source, 32))
    }
  }

  function bytesToAddress (bytes b) constant returns (address) {
    uint result = 0;
    for (uint i = 0; i < b.length; i++) {
      uint c = uint(b[i]);
      if (c >= 48 && c <= 57) {
        result = result * 16 + (c - 48);
      }
      if(c >= 65 && c<= 90) {
        result = result * 16 + (c - 55);
      }
      if(c >= 97 && c<= 122) {
        result = result * 16 + (c - 87);
      }
    }
    return address(result);
  }





  function balanceOf(address _owner) constant returns (uint256 balance) {
    return balances[_owner];
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

  function transfer(address _to, uint256 _value) returns (bool success){
    balances[msg.sender] = sub(balances[msg.sender], _value);
    balances[_to] = add(balances[_to], _value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  mapping (address => mapping (address => uint256)) allowed;

  function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
    var _allowance = allowed[_from][msg.sender];

    balances[_to] = add(balances[_to], _value);
    balances[_from] = sub(balances[_from], _value);
    allowed[_from][msg.sender] = sub(_allowance, _value);
    Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

}