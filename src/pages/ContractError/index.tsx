import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { secondaryText, text } from '../../constants/colors';
import { GlowingBtn } from '../../components/Button';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ErrorIcon } from '../../assets/images/error-icon.svg';

const NoMatchContainer = styled.div`
  overflow: hidden;
  margin-top: 40px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

export const ImgWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
  margin-bottom: 3rem;

  svg {
    width: 100%;
    max-height: 220px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 920px;
`;

const Heading = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${text};
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
`;

const Line = styled.p`
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  line-height: 1.5;
  white-space: pre-line;
  color: ${secondaryText};
  margin-bottom: 3rem;

  @media screen and (max-width: 520px) {
    font-size: 20px;
  }

  @media screen and (max-width: 420px) {
    font-size: 18px;
  }
`;

const ContractError = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const handleClick = () => {
		history.push('/');
	};
	return (
		<NoMatchContainer>
			<ImgWrap>
				<ErrorIcon />
			</ImgWrap>
			<TextWrapper>
				<Heading>{t('wrong_network')}</Heading>
				<Line>{t('lottery_not_deployed')}</Line>
			</TextWrapper>
			<GlowingBtn px={65} py={14} onClick={handleClick}>{t('home')} </GlowingBtn>
		</NoMatchContainer>
	);
};

export default ContractError;
