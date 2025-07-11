import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const addressMap = {
  uniswapFactory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  uniswapFactoryV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  YCRV: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
  UNIAmpl: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  UNIRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  LEND: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
  SUSHIYCRV: '0x2C7a51A357d5739C5C74Bf3C96816849d2c9F726',
}

//* Changed 3 refers to Ropsten testnet
export const contractAddresses = {
  sushi: {
    3: '0xdE1eF63b54B3E01E213d7B396dC828A7e12841F5',
  },
  masterChef: {
    3: '0x942Aa339B7ab2027c88F2F02883dB5909ebBB23a',
  },
  weth: {
    3: '0x0a180A76e4466bF68A7F86fB029BEd3cCcFaAac5',
  },
  chefmao: {
    3: '0x15b11CC6f4BC910A993d72b51d06fC47adc65d9a'
  }
}

/*
UNI-V2 LP Address on mainnet for reference
==========================================
0  USDT 0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852
1  USDC 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc
2  DAI  0xa478c2975ab1ea89e8196811f51a7b7ade33eb11
3  sUSD 0xf80758ab42c3b07da84053fd88804bcb6baa4b5c
4  COMP 0xcffdded873554f362ac02f8fb1f02e5ada10516f
5  LEND 0xab3f9bf1d81ddb224a2014e98b238638824bcf20
6  SNX  0x43ae24960e5534731fc831386c07755a2dc33d47
7  UMA  0x88d97d199b9ed37c29d846d00d443de980832a22
8  LINK 0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974
9  BAND 0xf421c3f2e695c2d4c0765379ccace8ade4a480d9
10 AMPL 0xc5be99a02c6857f9eac67bbce58df5572498f40c
11 YFI  0x2fdbadf3c4d5a8666bc06645b8358ab803996e28
12 SUSHI 0xce84867c3c02b05dc570d0135103d3fb9cc19433
*/

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      3: '0x58BD1b77488A8d4899ec31b0B2aF2872a4F9E4Cf',
    },
    tokenAddresses: {
      3: '0x58BD1b77488A8d4899ec31b0B2aF2872a4F9E4Cf',
    },
    name: "Uncle Sam's Corn",
    symbol: 'USDT',
    tokenSymbol: 'USDT',
    icon: '🌽',
    type: 'white',
    decimal: 6
  },
  {
    pid: 1,
    lpAddresses: {
      3: '0x0a180A76e4466bF68A7F86fB029BEd3cCcFaAac5',
    },
    tokenAddresses: {
      3: '0x0a180A76e4466bF68A7F86fB029BEd3cCcFaAac5',
    },
    name: 'Wrapped Eggplant',
    symbol: 'WETH',
    tokenSymbol: 'WETH',
    icon: '🍆',
    type: 'white',
    decimal: 18
  },
  {
    pid: 2,
    lpAddresses: {
      3: '0xdE1eF63b54B3E01E213d7B396dC828A7e12841F5',
    },
    tokenAddresses: {
      3: '0xdE1eF63b54B3E01E213d7B396dC828A7e12841F5',
    },
    name: 'Double Boiling Pot',
    symbol: 'POT',
    tokenSymbol: 'POT',
    icon: '🍲',
    type: 'red',
    decimal: 18
  },
  {
    pid: 3,
    lpAddresses: {
      3: '0x1b0751fB3aDC6B0a1D5B8d40e4e7a1D2971e0ba5',
    },
    tokenAddresses: {
      3: '0xdE1eF63b54B3E01E213d7B396dC828A7e12841F5',
    },
    name: 'Mala Lobster',
    symbol: 'USDT-POT UNI-V2',
    tokenSymbol: 'UNI-V2',
    icon: '🦞',
    type: 'red',
    decimal: 18
  },
]

export const tipTo = '0x0dBDba1F9e813216812A06Bf6d2f94Ed703D29F5'