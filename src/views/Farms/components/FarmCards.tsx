import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import useFarms from '../../../hooks/useFarms'
import useSushi from '../../../hooks/useSushi'
import {
  getMasterChefContract,
  getPoolApyValue,
  getChefMaoContract,
} from '../../../sushi/utils'

// interface FarmWithStakedValue extends Farm, StakedValue {
//   apy: BigNumber
// }

const FarmCards: React.FC = () => {
  const [farms] = useFarms()
  // const { account } = useWallet()
  // const stakedValue = []

  // const sushiIndex = farms.findIndex(
  //   ({ tokenSymbol }) => tokenSymbol === 'SUSHI',
  // )

  // const sushiPrice = new BigNumber(0)
  // sushiIndex >= 0 && stakedValue[sushiIndex]
  //   ? stakedValue[sushiIndex].tokenPriceInWeth
  //   : new BigNumber(0)

  // const BLOCKS_PER_YEAR = new BigNumber(2336000)
  // const SUSHI_PER_BLOCK = new BigNumber(1000)

  const rows = farms.reduce<Farm[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue = {
        ...farm,
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <StyledLoadingWrapper>
          <Loader text="Cooking the rice ..." />
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: Farm
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0)
  // const [harvestable, setHarvestable] = useState(0)
  const [apyValue, setApyValue] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const sushi = useSushi()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchApy() {
    const apy = await getPoolApyValue(
        getMasterChefContract(sushi),
        farm.lpContract,
        getChefMaoContract(sushi),
        farm.pid,
        farm.type,
      )
      setApyValue(apy)
    }
    if (sushi && account) {
      fetchApy()
    }
  }, [sushi, lpTokenAddress, account, setApyValue])

  const poolActive = true // startTime * 1000 - Date.now() <= 0
  //*Changed add type dot
  return (
    <StyledCardWrapper>
      {farm.type === 'red' && <StyledCardAccent />}
      <Card>
        <CardContent>
          <StyledContent>
            {farm.type === 'red' ? <StyledTypeDot>🌶️</StyledTypeDot> : null}
            <CardIcon>{farm.icon}</CardIcon>
            <StyledTitle>
              <div
                style={{ color: farm.type === 'red' ? '#dc0909' : 'inherit' }}
              >
                {farm.name}
              </div>
            </StyledTitle>
            <StyledDetails>
              <StyledDetail>Deposit {farm.lpToken.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn {farm.earnToken.toUpperCase()}</StyledDetail>
            </StyledDetails>
            <Spacer />
            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/farms/${farm.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            <StyledInsight>
              <span>APY</span>
              <span>
                {apyValue
                  ? `${new BigNumber(apyValue)
                      .times(new BigNumber(100))
                      .toNumber()
                      .toLocaleString('en-US')
                      .slice(0, -1)}%`
                  : 'Loading ...'}
              </span>
            </StyledInsight>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 60, 1) 0%,
    rgba(255, 0, 20, 1) 10%,
    rgba(255, 20, 0, 1) 20%,
    rgba(255, 60, 0, 1) 30%,
    rgba(255, 100, 0, 1) 40%,
    rgba(255, 140, 0, 1) 50%,
    rgba(255, 100, 0, 1) 60%,
    rgba(255, 60, 0, 1) 70%,
    rgba(255, 20, 0, 1) 80%,
    rgba(255, 0, 20, 1) 90%,
    rgba(255, 0, 60, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 3s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #fffdfa;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #e6dcd5;
  text-align: center;
  padding: 0 12px;
`

const StyledTypeDot = styled.div`
  position: absolute;
  right: 14px;
  font-size: 24px;
`
export default FarmCards
