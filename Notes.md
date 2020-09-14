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