import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { useWallet } from 'use-wallet'

import { getLpValue, getMasterChefContract, getFarms } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useAllLpValues = () => {
  const [balances, setBalance] = useState([])
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances = await Promise.all(
      farms.map(({ lpContract, pid }: { lpContract: Contract; pid: number }) =>
        getLpValue(lpContract, masterChefContract, pid),
      ),
    )
    setBalance(balances)
  }, [account, masterChefContract, sushi])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, sushi])

  return balances
}

export default useAllLpValues
