import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import pot from '../../assets/img/hotpot.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'
import useAllLpValues from '../../hooks/useAllLpValues'
import useFarms from '../../hooks/useFarms'

const PendingLpValues: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)
  const allLpValues = useAllLpValues()
  let sumValues = 0
  for (let lpValue of allLpValues) {
    sumValues += lpValue
  }

  const [farms] = useFarms()

  useEffect(() => {
    setStart(end)
    setEnd(sumValues)
  }, [sumValues])

  return (
    <span
      className="value"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      $
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
      USD
    </span>
  )
}

//*Changed home page text
const Home: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon={<img src={pot} height={120} />}
        title="Hotpot is Boiling"
        subtitle="Stake eligible tokens to claim Hotpot Base Tokens (POT)!"
      />

      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
      <StyledInfoLarge>
        <b>Total Staked Value</b> <PendingLpValues />
      </StyledInfoLarge>
      <StyledInfo>
        <b>Pro Tip</b>: Foods in 🌶️ Red soup have dedicated portion of POT
        rewards, go get them!
      </StyledInfo>
      <Spacer size="lg" />
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <Button text="📝 View Menu" to="/farms" variant="secondary" />
      </div>
    </Page>
  )
}
const StyledInfoLarge = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 22px;
  font-weight: 400;
  margin: 0 0 20px 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
  .value {
    font-weight: 600;
    color: ${(props) => props.theme.color.red[500]};
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
