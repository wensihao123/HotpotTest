import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import { useWallet } from 'use-wallet'

import { isInCircuitBreaker, getMasterChefContract } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

//*Changed add Circuit Breaker Listener
const usePoolState = () => {
  const [inCircuitBreaker, setInCircuitBreaker] = useState(Boolean)
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchState = useCallback(async () => {
    const inCB = await isInCircuitBreaker(masterChefContract)
    setInCircuitBreaker(inCB)
  }, [account, masterChefContract, sushi])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
        fetchState()
    }
  }, [account, block, masterChefContract, setInCircuitBreaker, sushi])

  return inCircuitBreaker
}

export default usePoolState