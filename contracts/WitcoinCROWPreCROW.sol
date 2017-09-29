pragma solidity ^0.4.2;

/// @title WitcoinCROW+PreCROW contract - Takes funds from users and issues tokens.
/// @author Evgeny Yurtaev - <evgeny@etherionlab.com>
contract WitcoinCROWPreCROW {
    /*
     * External contracts
     */
    address public witcoinToken;

    /*
     *  Storage
     */
    address public founder;
    address public multisig;
    uint public crowBalance = 0;
    uint public baseTokenPrice = 1136364000000000; // 0.00113636 ETH
    uint public discountedPrice = baseTokenPrice;
    bool public isCROWActive = false;
	// Start date of the PreCrowdsale
	uint public startDatePre = 1507618800;  // 2017-10-10 7:00:00 UTC
	// Start date of the Crowdsale
    uint public startDate = 1508079600;  // 2017-10-16 15:00:00 UTC
    // End date of the Crowdsale
    uint public endDate = 1509894000;  // 2017-11-06 15:00:00 UTC

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
		if(isCROWActive == false){
		    revert;
		}
        if ((startDatePre < now || (crowBalance >= 1000000 && startDate < now)) &&  endDate >= now) {
            revert;
        }
        _;
    }
	/// @dev Returns current token price
    function getCurrentBonus()
        public
		applyBonus
        returns (uint)
    {
        return discountedPrice;
    }
    modifier applyBonus() {
		if(now >= startDate){
			discountedPrice = baseTokenPrice;
		}
		else
        if (crowBalance >= 750001) {
            discountedPrice = 1000000000000000; // 0.001 ETH
        }
        else if (crowBalance >= 500001) {
            discountedPrice = 909091000000000; // 0.000909091 ETH
        }
        else if (crowBalance >= 250001) {
            discountedPrice = 851064000000000; // 0.000851064 ETH
        }
        else {
            discountedPrice = 800000000000000; // 0.0008 ETH
        }
        _;
    }

    /// @dev Allows user to create tokens if token creation is still going
    /// and cap was not reached. Returns token count.
    function fund()
        public
        applyBonus
        crowActive
        minInvestment
        payable
        returns (uint)
    {

        // Token count is rounded down. Sent ETH should be multiples of baseTokenPrice.
        uint tokenCount = msg.value / discountedPrice;
		if( now < startDate && tokenCount+crowBalance >= 1000000){
			tokenCount=1000000-crowBalance;
		}
        // Ether spent by user.
        uint investment = tokenCount * discountedPrice;
        // Send change back to user.
        if (msg.value > investment && !msg.sender.send(msg.value - investment)) {
            revert;
        }
        // Update fund's and user's balance and total supply of tokens.
        crowBalance += investment;
        investments[msg.sender] += investment;
        // Send funds to founders.
        if (!multisig.send(investment)) {
            // Could not send money
            revert;
        }
        if (!witcoinToken.issueTokens(msg.sender, tokenCount)) {
            // Tokens could not be issued.
            revert;
        }
        return tokenCount;
    }

    /// @dev Issues tokens for users who made purchases.
    /// @param beneficiary Address the tokens will be issued to.
    /// @param _tokenCount Number of tokens to issue.
    function fundALT(address beneficiary, uint _tokenCount)
        external
        applyBonus
        crowActive
        onlyFounder
        returns (uint)
    {
		if( now < startDate && tokenCount+crowBalance >= 1000000){
			tokenCount=1000000-crowBalance;
		}
        // Approximate ether spent.
        uint investment = _tokenCount * discountedPrice;
        // Update fund's and user's balance and total supply of tokens.
        crowBalance += investment;
        investments[beneficiary] += investment;
        if (!witcoinToken.issueTokens(beneficiary, _tokenCount)) {
            // Tokens could not be issued.
            revert;
        }
        return _tokenCount;
    }

    function finishCrowdsale()
        external
        onlyFounder
        returns (bool)
    {
        if (isCROWActive == true) {
            isCROWActive = false;
        }
    }

    /// @dev Function that activates crowdsale.
    function startCrowdsale()
        external
        onlyFounder
    {
        if (isCROWActive == false && startDate == 0) {
          // Start Crowdsale
          isCROWActive = true;
          // Set start-date of token creation
          startDate = now;
        }
    }

    /// @dev Contract constructor function sets founder and multisig addresses.
    function WitcoinCROWPreCROW(address tokenAddress,address _multisig) public {
		// Set token address
        witcoinToken = WitcoinToken(tokenAddress);
        // Set founder address
        founder = msg.sender;
        // Set multisig address
        multisig = _multisig;
    }

    /// @dev Fallback function. Calls fund() function to create tokens.
    function () public payable {
        fund();
    }
}