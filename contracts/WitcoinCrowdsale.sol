pragma solidity ^0.4.15;

import './dependencies/crowdsale/RefundVault.sol';
import './WitCoin.sol';

contract WitcoinCrowdsale is Ownable {
    using SafeMath for uint256;

    // The token being sold
    WitCoin public token;

    // refund vault used to hold funds while crowdsale is running
    RefundVault public vault;

    // minimum amount of tokens to be issued
    uint256 public goal;

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

    // amount of tokens distributed
    uint256 public tokensDistributed;

    // token decimals
    uint256 public decimals;

    // total of tokens sold in the presale time
    uint256 public totalTokensPresale;

    // total of tokens sold in the sale time (includes presale)
    uint256 public totalTokensSale;

    // minimum amount of witcoins bought
    uint256 public minimumWitcoins;

    /**
     * event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    function WitcoinCrowdsale(address witAddress, address receiver) {
        token = WitCoin(witAddress);
        decimals = token.getDecimals();
//        startTime = 1508137200; // 1508137200 = 2017-10-16 07:00:00 GMT
        startTime = 1506845576; // 2017-10-01
//        startPresale = 1507618800; // 1507618800 = 2017-10-10 07:00:00 GMT
        startPresale = 1504512776; // 2017-09-04
        endTime = 1509973200; // 2017-11-06 13:00:00 GMT
        //endTime = 1507191176; // 2017-10-05
        rate = 880; // 1 ether = 880 witcoins
        wallet = receiver;
        goal = 1000000 * (10 ** decimals); // 1M witcoins

        totalTokensPresale = 1000000 * (10 ** decimals) * 65 / 100; // 65% of 1M witcoins
        totalTokensSale = 8000000 * (10 ** decimals) * 65 / 100; // 65% of 8M witcoins
        minimumWitcoins = 100 * (10 ** decimals); // 100 witcoins
        tokensDistributed = 0;

        vault = new RefundVault(wallet);
    }

    // fallback function to buy tokens
    function () payable {
        buyTokens(msg.sender);
    }

    // main token purchase function
    function buyTokens(address beneficiary) public payable {
        require(beneficiary != 0x0);

        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = weiAmount.mul(rate)/1000000000000000000;
        tokens = tokens * (10 ** decimals);

        // calculate bonus
        tokens = calculateBonus(tokens);

        require(validPurchase(tokens));

        // update state
        weiRaised = weiRaised.add(weiAmount);
        tokensSold = tokensSold.add(tokens);

        token.mint(beneficiary, tokens);
        TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

        forwardFunds();
    }

    // altercoin token purchase function
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

    // send the ether to the fund collection wallet
    function forwardFunds() internal {
        vault.deposit.value(msg.value)(msg.sender);
    }

    // number of tokens issued after applying presale and sale bonuses
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

    // presale and sale constraints
    function validPurchase(uint256 tokens) internal returns (bool) {
        bool withinPeriod = presale() || sale();
        bool underLimits = (presale() && tokensSold + tokens <= totalTokensPresale) || (sale() && tokensSold + tokens <= totalTokensSale);
        bool overMinimum = tokens >= minimumWitcoins;
        return withinPeriod && underLimits && overMinimum;
    }

    function validPurchaseBonus(uint256 tokens) public returns (bool) {
        uint256 bonusedTokens = calculateBonus(tokens);
        return validPurchase(bonusedTokens);
    }

    // is presale time?
    function presale() public returns(bool) {
        return now >= startPresale && now < startTime;
    }

    // is sale time?
    function sale() public returns(bool) {
        return now >= startTime && now <= endTime;
    }

    // finalize crowdsale
    function finalize() onlyOwner public {
        require(now > endTime);

        if (tokensSold < goal) {
            vault.enableRefunds();
        } else {
            vault.close();
        }
    }

    function finalized() public returns(bool) {
        return vault.finalized();
    }

    // if crowdsale is unsuccessful, investors can claim refunds here
    function claimRefund() public returns(bool) {
        vault.refund(msg.sender);
    }

    // distribute tokens, only when goal reached
    function distributeTokens() onlyOwner public {
        require(tokensSold >= goal);
        require(tokensSold - tokensDistributed > 100);

        uint256 toDistribute = tokensSold - tokensDistributed;

        // As written in witcoin.io
        // 1% bounties
        // 5% nir-vana platform
        // 10% Team
        // 19% Witcoin.club

        address bounties = 0xcfe984b059de5fbfd8875e4a7e7a16298721b823;
        address nirvana = 0xcfe984b059de5fbfd8875e4a7e7a16298721b823;
        address team = 0xcfe984b059de5fbfd8875e4a7e7a16298721b823;
        address club = 0xcfe984b059de5fbfd8875e4a7e7a16298721b823;

        uint256 bTokens = toDistribute * 1 / 65;
        uint256 nTokens = toDistribute * 5 / 65;
        uint256 tTokens = toDistribute * 10 / 65;
        uint256 cTokens = toDistribute * 19 / 65;

        token.mint(bounties, bTokens);
        token.mint(nirvana, nTokens);
        token.mint(team, tTokens);
        token.mint(club, cTokens);

        tokensDistributed = tokensDistributed.add(toDistribute);
    }

}