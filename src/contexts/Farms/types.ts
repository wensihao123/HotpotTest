import { Contract } from 'web3-eth-contract'

//* Changed add pool type
export interface Farm {
  pid: number
  name: string
  lpToken: string
  lpTokenAddress: string
  lpContract: Contract
  tokenAddress: string
  earnToken: string
  earnTokenAddress: string
  icon: React.ReactNode
  id: string
  tokenSymbol: string
  type?: string
  decimal?: number
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
}
