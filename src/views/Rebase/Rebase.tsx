import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import moment from 'moment'

import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import Spacer from '../../components/Spacer'
import StatusGrid from './components/StatusGrid'
import WalletProviderModal from '../../components/WalletProviderModal'
import useModal from '../../hooks/useModal'
import useRebaseTimestamp from '../../hooks/useRebaseTimestamp'

//*Changed home page text
const Rebase: React.FC = () => {
  const { account } = useWallet()
  const [rebaseTimestamp, canRebase] = useRebaseTimestamp()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)



  return (
    <Page>
      {!!account ? (
        <>
          <Container>
            <Spacer size="lg" />
            <StyledInfo>
              <b>Next Rebase At</b>
            </StyledInfo>
            <StyledInfoLarge>
              {(rebaseTimestamp as Array<number>).length
                ? moment(rebaseTimestamp[1] * 1000).format(
                    'YYYY-MM-DD, hh:mm:ss',
                  )
                : 'Loading...'}
            </StyledInfoLarge>
          </Container>
          <Container>
            <StatusGrid />
          </Container>
          <Spacer size="lg" />
          <StyledInfo>
            <b>Pro Tip:</b> 🍲 Rebasing only affects overall POT production
            rate, your wallet balances are SAFU!
          </StyledInfo>
          <Spacer size="lg" />
          <div
            style={{
              margin: '0 auto',
            }}
          >
            <Button text="👩‍🍳 Rebase" to="/farms" variant="secondary" disabled ={!canRebase}/>
          </div>
        </>
      ) : (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={onPresentWalletProviderModal}
            text="🔓 Unlock Wallet"
          />
        </div>
      )}
    </Page>
  )
}
const StyledInfoLarge = styled.h3`
  color: ${(props) => props.theme.color.red[500]};
  font-size: 26px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
  .value {
    font-size: 28px;
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

export default Rebase
