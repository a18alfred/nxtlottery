import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ErrorIcon } from '../../assets/images/error-icon.svg';
import { secondaryText, text } from '../../constants/colors';
import { GlowingBtn } from '../../components/Button';
import { useHistory } from 'react-router-dom';

const NoMatchContainer = styled.div`
  overflow: hidden;
  margin-top: 40px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

const ImgWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
  margin-bottom: 2rem;

  svg {
    max-height: 220px;
  }
`;

const Heading = styled.h1`
  font-size: 108px;
  font-weight: 800;
  color: ${text};
  text-align: center;
  margin-bottom: 1rem;
`;

const LineBottom = styled.h3`
  font-size: 24px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${secondaryText};
  margin-bottom: 3rem;
`;

const NoMatch = () => {
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
			<Heading>404</Heading>
			<LineBottom>{t('page_not_found')}</LineBottom>
			<GlowingBtn px={65} py={14} onClick={handleClick}>{t('home')} </GlowingBtn>
		</NoMatchContainer>
	);
};

export default NoMatch;
