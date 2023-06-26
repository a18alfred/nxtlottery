import { MouseEvent } from 'react';
import styled from 'styled-components';
import { ReactComponent as ConnectionErrorIcon } from '../../../../assets/images/no-connection.svg';
import { secondaryText, text } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { GlowingBtn } from '../../../../components/Button';
import { user_loading } from '../../../../state/user/slice';
import { useWeb3Modal } from '@web3modal/react';
import { useAppDispatch } from '../../../../state/hooks';

const NoConnectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin-bottom: 70px;
  gap: 2rem;

  @media screen and (max-width: 880px) {
    margin-bottom: 105px;
  }
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
  margin: 2rem 0 0 0;

  svg {
    max-height: 200px;
  }
`;

const HeaderText = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${text};
  text-align: center;

  @media screen and (max-width: 520px) {
    font-size: clamp(1.5rem, 0.375rem + 5vw, 2rem);
  }
`;

const TextSecondary = styled.p`
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  color: ${secondaryText};
  margin-bottom: 1rem;

  @media screen and (max-width: 520px) {
    font-size: clamp(1.125rem, 0.2813rem + 3.75vw, 1.5rem);
  }
`;

const NoConnection = () => {
	const { t } = useTranslation();
	const { open } = useWeb3Modal();
	const dispatch = useAppDispatch();

	const onConnect = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(user_loading());
		open();
	};

	return (
		<NoConnectionContainer>
			<IconWrap>
				<ConnectionErrorIcon />
			</IconWrap>
			<HeaderText>
				{t('wallet_not_connected')}
			</HeaderText>
			<TextSecondary>
				{t('connect_to_see_tickets')}
			</TextSecondary>
			<GlowingBtn
				px={50} py={14}
				onClick={onConnect}
			>
				{t('connect')}
			</GlowingBtn>
		</NoConnectionContainer>
	);
};

export default NoConnection;
