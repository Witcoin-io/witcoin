pragma solidity ^0.4.11;

import "./dependencies/crowdsale/FinalizableCrowdsale.sol";
import './WitCoin.sol';

contract WitcoinCrowdsale is Ownable {
    using SafeMath for uint256;

    // The token being sold
    WitCoin public token;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public startTime;
    uint256 public startPresale;
    uint256 public endTime;

    // address where funds are collected
    address public wallet;

    // how many token units a buyer gets per ether
    uint256 public rate;

    // amount of raised money in wei
    uint256 public weiRaised;

    // amount of tokens sold
    uint256 public tokensSold;

    uint256 public decimals;
    uint256 public totalTokensPresale;
    uint256 public totalTokensSale;
    uint256 public minimumWitcoins;

    /**
     * event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    // StartTime = 1508137200 = 2017-10-16 07:00:00 GMT
    // StartPresale = 1507618800 = 2017-10-10 07:00:00 GMT
    // EndTime = 1509973200 = 2017-11-06 13:00:00 GMT
    // Rate = 880 (1 ether = 880 witcoins)
    function WitcoinCrowdsale(address witAddress) {
        token = WitCoin(witAddress);
        decimals = token.getDecimals();
        startTime = 1508137200;
        //startPresale = 1507618800;
        startPresale = 1504512776;
        endTime = 1509973200;
        rate = 880;
        wallet = 0xf1f42f995046E67b79DD5eBAfd224CE964740Da3;

        totalTokensPresale = 1000000 * (10 ** decimals);
        totalTokensSale = 8000000 * (10 ** decimals);
        minimumWitcoins = 100 * (10 ** decimals);
    }

    // fallback function can be used to buy tokens
    function () payable {
        buyTokens(msg.sender);
    }

    // low level token purchase function
    function buyTokens(address beneficiary) public payable {
        require(beneficiary != 0x0);

        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = weiAmount.mul(rate)/1000000000000000000;
        tokens = tokens * (10 ** decimals);

        // calculate bonus
        tokens = calculateBonus(tokens);

        require(nonZeroPurchase(tokens));
        //require(validPurchase(tokens));

        // update state
        weiRaised = weiRaised.add(weiAmount);
        tokensSold = tokensSold.add(tokens);

        token.mint(beneficiary, tokens);
        TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

        forwardFunds();
    }

    function buyTokensAltercoins(address beneficiary, uint256 tokens) onlyOwner public {
        require(beneficiary != 0x0);

        // calculate bonus
        uint256 tokensBonused = calculateBonus(tokens);

        require(validPurchase(tokensBonused));

        // update state
        tokensSold = tokensSold.add(tokensBonused);

        token.mint(beneficiary, tokensBonused);
        TokenPurchase(msg.sender, beneficiary, 0, tokensBonused);
    }

    // send ether to the fund collection wallet
    // override to create custom fund forwarding mechanisms
    function forwardFunds() internal {
        wallet.transfer(msg.value);
    }

    function calculateBonus(uint256 tokens) internal returns (uint256) {
        uint256 bonusedTokens = tokens;

        // Pre-Sale Bonus
        if (presale()) {
            if (tokensSold <= 250000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(130)/100;
            else if (tokensSold <= 500000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(125)/100;
            else if (tokensSold <= 750000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(120)/100;
            else if (tokensSold <= 1000000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(115)/100;
        }

        // Sale Bonus
        if (sale()) {
            if (bonusedTokens > 2500 * (10 ** decimals)) {
                if (bonusedTokens <= 80000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(105)/100;
                else if (bonusedTokens <= 800000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(110)/100;
                else if (bonusedTokens > 800000 * (10 ** decimals)) bonusedTokens = bonusedTokens.mul(120)/100;
            }
        }

        return bonusedTokens;
    }

    // @return true if the transaction can buy tokens
    function validPurchase(uint256 tokens) returns (bool) {
        bool withinPeriod = presale() || sale();
        bool underLimits = (presale() && tokensSold + tokens <= totalTokensPresale) || (sale() && tokensSold + tokens <= totalTokensSale);
        bool overMinimum = tokens >= minimumWitcoins;
        return withinPeriod && underLimits && overMinimum;
    }

    function nonZeroPurchase(uint256 tokens) internal returns (bool) {
        bool nonZeroPurchase = msg.value != 0;
        return nonZeroPurchase;
    }

    function presale() public returns(bool) {
        return now >= startPresale && now < startTime;
    }

    function sale() public returns(bool) {
        return now >= startTime && now <= endTime;
    }
}