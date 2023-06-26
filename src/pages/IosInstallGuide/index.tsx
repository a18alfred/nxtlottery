import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AppleIcon from '@mui/icons-material/Apple';
import { lotteryNumbersBg, secondaryText, text } from '../../constants/colors';
import { GlowingBtn } from '../../components/Button';
import { useHistory } from 'react-router-dom';
import IosShareIcon from '@mui/icons-material/IosShare';

const IosInstallGuideContainer = styled.div`
  overflow: hidden;
  margin-top: 40px;
  margin-bottom: 108px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  gap: 1rem
`;

const LogoWrapper = styled.div<{ logoColor: string }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
  margin-bottom: 2rem;
  color: ${({ logoColor }) => logoColor};

  svg {
    height: 120px;
    width: auto;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${text};
  text-align: center;
  margin-bottom: 1rem;
`;

const LineBottom = styled.p<{ extraMargin?: boolean; }>`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  color: ${secondaryText};
  margin-bottom: ${({ extraMargin }) => extraMargin ? '2rem' : 0};
`;

const ShareIconStyled = styled(IosShareIcon)`
  color: ${secondaryText};
  margin-top: -3px;
  margin-left: 3px;
`;

const IosInstallGuide = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const logoColor = lotteryNumbersBg['lottery420'];

	const handleClick = () => {
		history.push('/');
	};

	return (
		<IosInstallGuideContainer>
			<LogoWrapper logoColor={logoColor}>
				<AppleIcon />
			</LogoWrapper>
			<Heading>
				{t('to_install_this_app')}
			</Heading>
			<LineBottom>
				<span>{t('tap_the_share')}</span>
				<ShareIconStyled />
			</LineBottom>
			<LineBottom extraMargin={true}>
				{t('then_find_and_tap')}
			</LineBottom>
			<GlowingBtn px={65} py={14} onClick={handleClick}>{t('home')} </GlowingBtn>
		</IosInstallGuideContainer>
	);
};

export default IosInstallGuide;
