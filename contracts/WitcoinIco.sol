pragma solidity ^0.4.2;

import "./WitCoin.sol";

contract Safemath {
    uint256 constant public MAX_UINT256 =
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    function safeAdd(uint256 x, uint256 y) constant internal returns (uint256 z) {
        if (x > MAX_UINT256 - y) throw;
        return x + y;
    }

    function safeSub(uint256 x, uint256 y) constant internal returns (uint256 z) {
        if (x < y) throw;
        return x - y;
    }

    function safeMul(uint256 x, uint256 y) constant internal returns (uint256 z) {
        if (y == 0) return 0;
        if (x > MAX_UINT256 / y) throw;
        return x * y;
    }
}

/// @title Witcoin PreSale and Token Sale contract - Takes funds from users and issues tokens.
/// @author Victor Munoz
contract WitcoinIco is Safemath {

    /*
     * External contracts
     */
    WitCoin public coin;

    /*
     *  Storage
     */
    address public founder;
    uint public crowBalance = 0;
    uint public baseTokenPrice = 0.11363636 ether; // 100 witcoins (880 witcoins per 1 ether)
    uint public totalPresale = 1000000;
    uint public totalSale = 8000000;
	// Start date of the PreCrowdsale
	uint public startDatePre = 1507618800;  // 2017-10-10 07:00:00 GMT
	// Start date of the Crowdsale
    uint public startDate = 1508137200;  // 2017-10-16 07:00:00 GMT
    // End date of the Crowdsale
    uint public endDate = 1509973200;  // 2017-11-06 13:00:00 GMT

    // participant address => value in Wei
    mapping (address => uint) public investments;

    /*
     *  Modifiers
     */
    modifier onlyFounder() {
        // Only founder is allowed to do this action.
        if (msg.sender != founder) {
            revert;
        }
        _;
    }

    modifier minInvestment() {
        // User has to send at least the ether value of one token.
        if (msg.value < baseTokenPrice) {
            revert;
        }
        _;
    }

    modifier crowActive() {
        if ((preSale() && crowBalance > totalPresale) || (sale() && crowBalance > totalSale) || (!preSale() && !sale())) {
            revert;
        }
        _;
    }

    function preSale() internal returns(bool) {
        return now >= startDatePre && now < startDate;
    }

    function sale() internal returns(bool) {
        return now >= startDate && now <= endDate;
    }

    /// @dev Allows user to create tokens if token creation is still going
    /// and cap was not reached. Returns token count.
    function fund()
        public
        crowActive
        minInvestment
        payable
        returns (uint)
    {
        // Check limits
        uint _tokenCount = msg.value;
        if (preSale() && _tokenCount + crowBalance >= totalPresale){
            _tokenCount = totalPresale - crowBalance;
        }
        if (sale() && _tokenCount + crowBalance >= totalSale){
            _tokenCount = totalSale - crowBalance;
        }

        // Investment
        uint investment = _tokenCount;

        // Send change back to user
        if (msg.value > investment && !msg.sender.send(msg.value - investment)) {
            revert;
        }

        investment = calculateBonus(investment);

        // Update fund's and user's balance and total supply of tokens
        crowBalance = safeAdd(crowBalance, investment);
        investments[msg.sender] = safeAdd(investments[msg.sender], investment);

        if (!coin.mint(msg.sender, investment)) {
            // Tokens could not be issued
            revert;
        }
        return investment;
    }

    /// @dev Issues tokens for users who made purchases.
    /// @param beneficiary Address the tokens will be issued to.
    /// @param tokenCount Number of tokens to issue.
    function fundALT(address beneficiary, uint tokenCount)
        external
        crowActive
        onlyFounder
        returns (uint)
    {
        // Check limit
        uint _tokenCount = tokenCount;
		if (preSale() && _tokenCount + crowBalance >= totalPresale){
            _tokenCount = totalPresale - crowBalance;
		}
        if (sale() && _tokenCount + crowBalance >= totalSale){
            _tokenCount = totalSale - crowBalance;
        }

        // Investment
        uint256 investment = _tokenCount;

        // Min investment
        //if (_tokenCount < 100) {
        //    revert;
        //}

        investment = calculateBonus(investment);

        // Update fund's and user's balance and total supply of tokens
        crowBalance = safeAdd(crowBalance, investment);
        investments[beneficiary] = safeAdd(investments[beneficiary], investment);

        if (!coin.mint(beneficiary, investment)) {
            // Tokens could not be issued
            revert;
        }
        return investment;
    }

    function calculateBonus(uint256 _investment) internal returns (uint256) {
        uint256 investment = _investment;

        // Pre-Sale Bonus
        if (preSale()) {
            if (crowBalance <= 250000) investment = investment * 100 / 70;
            else if (crowBalance <= 500000) investment = investment * 100 / 75;
            else if (crowBalance <= 750000) investment = investment * 100 / 80;
            else if (crowBalance <= 1000000) investment = investment * 100 / 85;
        }

        // Sale Bonus
        if (sale()) {
            if (investment > 2500) {
                if (investment <= 80000) investment = investment * 105 / 100;
                else if (investment <= 800000) investment = investment * 110 / 100;
                else if (investment > 800000) investment = investment * 120 / 100;
            }
        }

        if (investment < _investment)
        revert;

        return investment;
    }

    /// @dev Contract constructor function sets founder address and token contract
    function WitcoinIco(address tokenAddress) public {
		// Set token contract
        coin = WitCoin(tokenAddress);
        // Set founder address
        founder = msg.sender;
    }

    /// @dev Fallback function. Calls fund() function to create tokens.
    function () public payable {
        fund();
    }
}
