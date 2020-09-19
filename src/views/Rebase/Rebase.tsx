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
import { rebase, getChefMaoContract } from '../../sushi/utils'
import useSushi from '../../hooks/useSushi'

//*Changed home page text
const Rebase: React.FC = () => {
  const { account } = useWallet()
  const sushi = useSushi()
  const chefMaoContract = getChefMaoContract(sushi)
  const [rebaseTimestamp, canRebase] = useRebaseTimestamp()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  return (
    <Page>
      {!!account ? (
        <>
          <Container>
            <Spacer size="lg" />
            <StyledIcon>👩‍🍳</StyledIcon>
            <StyledTitle>Next Rebasing at</StyledTitle>
            <StyledInfoLarge>
              {(rebaseTimestamp as Array<number>).length
                ? moment(rebaseTimestamp[1] * 1000).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                : 'Loading...'}
            </StyledInfoLarge>
          </Container>
          <Spacer size="md" />
          <Container>
            <StatusGrid />
          </Container>
          <Spacer size="lg" />
          <StyledInfo>
            🛡️ Rebasing only affects POT production rate. Your wallet balances
            are SAFU!
          </StyledInfo>
          <Spacer size="lg" />
          <div
            style={{
              margin: '0 auto',
            }}
          >
            <Button
              text="👩‍🍳 Rebase"
              onClick={() => rebase(chefMaoContract, account)}
              variant="secondary"
              disabled={!canRebase}
            />
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
  font-size: 30px;
  font-weight: 600;
  margin: 0 0 7px 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
  .value {
    font-size: 38px;
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

const StyledTitle = styled.h1`
  font-family: 'Reem Kufi', sans-serif;
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  padding: 0;
  text-align: center;
`

const StyledIcon = styled.div`
  font-size: 90px;
  height: 120px;
  line-height: 120px;
  text-align: center;
`

export default Rebase
