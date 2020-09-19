import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import useRebaseTimestamp from '../../../hooks/useRebaseTimestamp'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'
import {
  getSushiAddress,
  getSushiSupply,
  getPotPerBlock,
  getMasterChefContract,
  getChefMaoContract,
  getCurrentTwap,
  getTargetPrice,
  getNewHotpotBasePerBlock,
} from '../../../sushi/utils'
import {
  getBalanceNumber,
  getBalanceNumberFixed,
  getDisplayBalance,
  getDisplayBalanceFixed,
} from '../../../utils/formatBalance'

const StatusGrid: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [potPerBlock, setPotPerBlock] = useState<BigNumber>()
  const [twap, setTwap] = useState({})
  const [targetPrice, setTargetPrice] = useState(0)
  const [projectedReward, setProjectedReward] = useState(0)
  const [rebaseTimestamp] = useRebaseTimestamp()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const chefMaoContract = getChefMaoContract(sushi)
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  useEffect(() => {
    async function fetchAll() {
      const supply = await getSushiSupply(sushi)
      const potPerBlock = await getPotPerBlock(masterChefContract)
      const twap = await getCurrentTwap(chefMaoContract)
      const targetPrice = await getTargetPrice(chefMaoContract)
      const projectedReward = await getNewHotpotBasePerBlock(
        chefMaoContract,
        twap[2],
      )
      setTotalSupply(supply)
      setPotPerBlock(potPerBlock)
      setTwap(twap)
      setTargetPrice(targetPrice)
      setProjectedReward(projectedReward)
    }
    if (sushi) {
      fetchAll()
    }
  }, [
    sushi,
    setTotalSupply,
    setPotPerBlock,
    setTwap,
    setTargetPrice,
    setProjectedReward,
  ])

  return (
    <>
      <StyledWrapper>
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <span
                  role="img"
                  style={{
                    fontSize: 32,
                  }}
                >
                  💰
                </span>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Current Price (TWAP)" />
                  <Value
                    value={
                      !!account && twap[2]
                        ? getDisplayBalanceFixed(new BigNumber(twap[2]), 18, 4)
                        : 'Locked'
                    }
                  />
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
          <Footnote>
            Last update at
            <FootnoteValue>
              {twap[1]
                ? moment(twap[1] * 1000).format('YYYY-MM-DD HH:mm:ss')
                : 'Locked'}
            </FootnoteValue>
          </Footnote>
        </Card>
        <Spacer />
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <span
                  role="img"
                  style={{
                    fontSize: 32,
                  }}
                >
                  🎯
                </span>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Target Price" />
                  <Value
                    value={
                      targetPrice
                        ? getDisplayBalanceFixed(
                            new BigNumber(targetPrice),
                            18,
                            4,
                          )
                        : 'Locked'
                    }
                  />
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
          <Footnote>
            Last rebasing at
            <FootnoteValue>
              {(rebaseTimestamp as Array<number>).length
                ? moment(rebaseTimestamp[0] * 1000).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                : 'Locked'}
            </FootnoteValue>
          </Footnote>
        </Card>
      </StyledWrapper>
      <Spacer size="lg" />
      <StyledWrapper>
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <span
                  role="img"
                  style={{
                    fontSize: 32,
                  }}
                >
                  🧮
                </span>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Current POT Supply" />
                  <Value
                    value={
                      totalSupply ? getBalanceNumber(totalSupply) : 'Locked'
                    }
                  />
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
          <Footnote>
            Market Value
            <FootnoteValue>
              {!!account && twap[2]
                ? `$${getDisplayBalance(
                    new BigNumber(twap[2])
                      .times(totalSupply)
                      .dividedBy(new BigNumber(1e18)),
                  )}`
                : 'Locked'}
            </FootnoteValue>
          </Footnote>
        </Card>
        <Spacer />
        <Card>
          <CardContent>
            <StyledBalances>
              <StyledBalance>
                <span
                  role="img"
                  style={{
                    fontSize: 32,
                  }}
                >
                  🍲
                </span>
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Current Rewards per Block" />
                  <Value
                    value={
                      potPerBlock
                        ? `${getBalanceNumberFixed(
                            new BigNumber(potPerBlock)
                          )} POT`
                        : 'Locked'
                    }
                  />
                </div>
              </StyledBalance>
            </StyledBalances>
          </CardContent>
          <Footnote>
            Projected rewards per block
            <FootnoteValue>
              {projectedReward[0]
                ? `${getBalanceNumberFixed(
                    new BigNumber(projectedReward[0])
                  )} POT`
                : 'Locked'}              
            </FootnoteValue>
          </Footnote>
        </Card>
      </StyledWrapper>
    </>
  )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.grey[400]};
  border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default StatusGrid
