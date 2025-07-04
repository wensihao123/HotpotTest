import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'
import { useWallet } from 'use-wallet'
import moment from 'moment'
import { getChefMaoContract, getRebaseTimestamp, inRebaseWindow } from '../sushi/utils'
import useSushi from './useSushi'


const useRebaseTimestamp = () => {
  const [rebaseTimestamp, setRebaseTimestamp] = useState([])
  const [canRebase, setCanRebase] = useState(false)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const chefMaoContract = getChefMaoContract(sushi)

  const fetchRebaseTimestamp = useCallback(async () => {
    const rebaseTimestamp = await getRebaseTimestamp(chefMaoContract)
    //const canRebase = await inRebaseWindow(chefMaoContract)
    setRebaseTimestamp(rebaseTimestamp)
    //setCanRebase(canRebase)
  }, [account, chefMaoContract, sushi])

  useEffect(() => {
    if (account && chefMaoContract && sushi) {
        fetchRebaseTimestamp()
    }
  
  }, [account, chefMaoContract, setRebaseTimestamp, setCanRebase ,sushi])
  return [rebaseTimestamp, (rebaseTimestamp[1] * 1000 < moment.utc().valueOf())]
}

export default useRebaseTimestamp
