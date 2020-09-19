import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { tipTo } from './lib/constants'
import { lpPrice } from './lib/lpPrice'

const Web3 = require('web3')
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}
export const getChefMaoAddress = (sushi) => {
  return sushi && sushi.chefMaoAddress
}
export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}
export const getChefMaoContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.chefMao
}

export const getFarms = (sushi) => {
  return sushi
    ? sushi.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
          type,
          decimal
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'pot',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
          type,
          decimal
        }),
      )
    : []
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.earned(pid, account).call() //*Changed sushi chef abi function to hotpot abi function
}

export const isInCircuitBreaker = async (masterChefContract) => {
  return masterChefContract.methods.inCircuitBreaker().call() //*Changed add inCircuitBreaker method call
}

export const getPotPerBlock = async (masterChefContract) => {
  return masterChefContract.methods.hotpotBasePerBlock().call() //*Changed add PotPerBlock method call
}

export const getLpValue = async (lpContract, masterChefContract, pid) => {
  const lpSupply = await lpContract.methods
    .balanceOf(masterChefContract.options.address)
    .call()
  const lpDecimal = await lpContract.methods.decimals().call()
  const lpValue = (lpSupply * lpPrice[pid].pirce) / 10 ** lpDecimal
  return lpValue
}

//*Changed Add apy calculation
export const getPoolApyValue = async (
  masterChefContract,
  lpContract,
  chefMaoContract,
  pid,
  poolType,
) => {
  const lpValue = await getLpValue(lpContract, masterChefContract, pid)
  const poolInfo = await masterChefContract.methods.poolInfo(pid).call()
  const allocPoint = poolInfo[1]
  const redPotShare = await masterChefContract.methods.redPotShare().call()
  let poolWeight
  if (poolType === 'red') {
    const totalRedAllocPoint = await masterChefContract.methods
      .totalRedAllocPoint()
      .call()
    poolWeight = (allocPoint * redPotShare) / totalRedAllocPoint / 1e12
  } else {
    const totalWhiteAllocPoint = await masterChefContract.methods
      .totalWhiteAllocPoint()
      .call()
    poolWeight =
      (allocPoint * (1e12 - redPotShare)) / totalWhiteAllocPoint / 1e12
  }
  const twap =
    (await chefMaoContract.methods.getCurrentTwap().call()).twap / 1e18
  const potPerBlock =
    (await masterChefContract.methods.hotpotBasePerBlock().call()) / 1e18
  const apy = (twap * potPerBlock * poolWeight * 2.4e6) / lpValue
  return apy
}

//*Changed Add rebase timestamp calculation
export const getRebaseTimestamp = async (chefMaoContract) => {
  const lastRebaseTimestamp = Number(await chefMaoContract.methods.lastRebaseTimestamp().call())
  const rebaseWindowOffset = Number(await chefMaoContract.methods.rebaseWindowOffsetSec().call())
  const rebaseInterval = Number(await chefMaoContract.methods.minRebaseTimeIntervalSec().call())
  const nextRebaseTimestamp = lastRebaseTimestamp - (lastRebaseTimestamp % rebaseInterval) + rebaseWindowOffset
  return [lastRebaseTimestamp, nextRebaseTimestamp]
}


export const inRebaseWindow = async (chefMaoContract) => {
  const inRebaseWindow = await chefMaoContract.methods.inRebaseWindow().call()
  return inRebaseWindow
}

//*Changed Twap returned value [priceCumulative, blockTimestamp, twap]
export const getCurrentTwap = async (chefMaoContract) => {
  const currentTwap = await chefMaoContract.methods.getCurrentTwap().call()
  return currentTwap
}

export const getTargetPrice = async (chefMaoContract) => {
  const targetPrice = await chefMaoContract.methods.targetPrice().call()
  return targetPrice
}

export const getNewHotpotBasePerBlock = async (chefMaoContract, twap) => {
  const projectedReward = await chefMaoContract.methods.getNewHotpotBasePerBlock(twap).call()
  return projectedReward
}

export const rebase = async (chefMaoContract, account) => {
  return chefMaoContract.methods
    .rebase()
    .send({ from: account })
}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  const balance = await lpContract.methods
    .balanceOf(masterChefContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .claimReward(pid, tipTo)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const harvest0 = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
