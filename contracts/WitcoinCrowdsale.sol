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

    uint256 public totalTokensPresale = 1000000;
    uint256 public totalTokensSale = 8000000;

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
    function WitcoinCrowdsale(uint256 _startTime, uint256 _startPresale, uint256 _endTime, uint256 _rate, address _wallet) {
        require(_startTime >= now);
        //require(_startPresale >= now);
        require(_endTime >= _startTime);
        require(_rate > 0);
        require(_wallet != 0x0);

        token = createTokenContract();
        startTime = _startTime;
        startPresale = _startPresale;
        endTime = _endTime;
        rate = _rate;
        wallet = _wallet;
    }

    // creates the token to be sold.
    // override this method to have crowdsale of a specific mintable token.
    function createTokenContract() internal returns (WitCoin) {
        return new WitCoin();
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

        // calculate bonus
        tokens = calculateBonus(tokens);

        require(nonZeroPurchase(tokens));
        require(validPurchase(tokens));

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
            if (tokensSold <= 250000) bonusedTokens = bonusedTokens.mul(130)/100;
            else if (tokensSold <= 500000) bonusedTokens = bonusedTokens.mul(125)/100;
            else if (tokensSold <= 750000) bonusedTokens = bonusedTokens.mul(120)/100;
            else if (tokensSold <= 1000000) bonusedTokens = bonusedTokens.mul(115)/100;
        }

        // Sale Bonus
        if (sale()) {
            if (bonusedTokens > 2500) {
                if (bonusedTokens <= 80000) bonusedTokens = bonusedTokens.mul(105)/100;
                else if (bonusedTokens <= 800000) bonusedTokens = bonusedTokens.mul(110)/100;
                else if (bonusedTokens > 800000) bonusedTokens = bonusedTokens.mul(120)/100;
            }
        }

        return bonusedTokens;
    }

    // @return true if the transaction can buy tokens
    function validPurchase(uint256 tokens) internal returns (bool) {
        bool withinPeriod = presale() || sale();
        bool underLimits = (presale() && tokensSold + tokens <= totalTokensPresale) || (sale() && tokensSold + tokens <= totalTokensSale);
        return withinPeriod && underLimits;
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