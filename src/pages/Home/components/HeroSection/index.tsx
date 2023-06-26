import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import HeroImage from '../../../../assets/images/hero-image.webp';
import { useHistory } from 'react-router-dom';
import { GlowingBtn } from '../../../../components/Button';
import { secondaryText, text } from '../../../../constants/colors';
import { ImgWrapper } from '../ImgWrapper';

export const HeroSectionWrapper = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-template-areas: 'col1 col2';

  @media screen and (max-width: 880px) {
    grid-template-areas: 'col1' 'col2';
    gap: 2rem;
  }
`;

const ColumnText = styled.div`
  grid-area: col1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 1rem;

  @media screen and (max-width: 880px) {
    align-items: center;
    gap: 1rem;
    padding: 0;
    max-width: 100%;
  }
`;

export const ColumnImage = styled.div`
  grid-area: col2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 880px) {
    justify-content: center;
  }
`;

export const LineTop = styled.h2`
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${secondaryText};

  @media screen and (max-width: 880px) {
    text-align: center;
  }
`;

const LineBottom = styled.h3`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  color: ${secondaryText};

  @media screen and (max-width: 880px) {
    text-align: center;
  }
`;

const Heading = styled.h1`
  font-size: 64px;
  line-height: 1.2;
  font-weight: 800;
  color: ${text};
  text-align: left;

  @media screen and (max-width: 880px) {
    text-align: center;
    font-size: 10vmin;
  }
`;


const ImgContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 2rem;
`;

const Img = styled.img`
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 1rem;
`;

const HeroSection = () => {
	const history = useHistory();
	const { t } = useTranslation();

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push('/lotteries');
	};

	return (
		<HeroSectionWrapper>
			<ColumnText>
				<LineTop>{t('introducing_nxtlottery')}</LineTop>
				<Heading>{t('fully_automated_blockchain_lottery')}</Heading>
				<LineBottom>{t('nxtlottery_delivers_decentralised')}</LineBottom>
				<ButtonWrapper>
					<GlowingBtn px={50} py={14} onClick={handleClick}>{t('try_now')}</GlowingBtn>
				</ButtonWrapper>
			</ColumnText>
			<ColumnImage>
				<ImgContainer>
					<ImgWrapper height={1127} width={847}>
						<Img
							src={HeroImage}
							alt={'Eth image'}
						/>
					</ImgWrapper>
				</ImgContainer>
			</ColumnImage>
		</HeroSectionWrapper>
	);
};

export default HeroSection;
