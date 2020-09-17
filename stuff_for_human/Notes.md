## Calculating APY (Annualized Percentage Yield)

lpSupply = ERC20(lpToken).balanceOf(contractAddresses.masterChef) / ERC20(lpToken).decimals;
lpValue = lpSupply * lpPrice[pid];

if pool.type = 'red'
    poolWeight = YuanYangPot.poolInfo[pid].allocPoint * YuanYangPot.redPotShare / YuanYangPot.totalRedAllocPoint / 1e12;
else
    poolWeight = YuanYangPot.poolInfo[pid].allocPoint * (1e12 - YuanYangPot.redPotShare) / YuanYangPot.totalWhiteAllocPoint / 1e12;


(priceCumulative, blockTimestamp, twap) = ChefMao.getCurrentTwap();

APY = twap * YuanYangPot.hotpotBasePerBlock * poolWeight * 2.4e6 / lpValue / 1e18;

## Calculating TVL (Total Value Locked)

TVL = Sum (lpValue)


## New YuanYangPot
* Redirect Core contract to new Ropsten YuanYangPot: 0x62De147CCAFe5E928eD9B2e404bCb4dFA6BEFafD
* New POT Token Contract: 0x62De147CCAFe5E928eD9B2e404bCb4dFA6BEFafD
* 3 existing pools are kept unchanged, they are all WHITE pools. 
* 1 extra pool #3 added (0x759472D80851A7Df6Bc57AFAc4941614E756d331) as a RED pool:
YuanYangPot.poolInfo[3].isRed == true

## Addtitonal Front-end Request
* When YuanYangPot in Circuit Breaker Mode (YuanYangPot.inCircuitBreaker == true)
* Display a warning on each pool page "POT harvesting is suspended during Circuit Breaker period."
* Grey-out "Harvest" button.

## Ropsten Uniswap
URL (Add Liquidity): https://app.uniswap.org/#/add/0x64bf48384C484a1dA5e1749Daef138733736D7Fb/0x759472D80851A7Df6Bc57AFAc4941614E756d331

Customed Token List: ipfs://QmTP5SexML7frYAfdQ5KZjoLGt177Hb4H1vxAUsu8UWWc7
