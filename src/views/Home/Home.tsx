import React from 'react'
import styled from 'styled-components'
import pot from '../../assets/img/hotpot.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'

//*Changed home page text
const Home: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon={<img src={pot} height={120} />}
        title="YuanYangPot is Boiling"
        subtitle="Stake eligible tokens to claim Hotpot Base Tokens (POT)!"
      />

      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
      <StyledInfo>
        <b>Pro Tip</b>: Foods in 🌶️ Red soup have dedicated portion of POT rewards, go get them!
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
