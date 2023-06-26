import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { cardBgColor, secondaryText } from '../../../../constants/colors';
import VrfLogo from '../../../../assets/images/chainlink-vrf.webp';
import ChainLinkLogo from '../../../../assets/images/chainlink-logo.webp';
import PolygonLogo from '../../../../assets/images/polygon-logo.webp';
import SmartLogo from '../../../../assets/images/smart-logo.webp';
import { ImgWrapper } from '../ImgWrapper';

const BenefitSectionContainer = styled.div`
  margin-top: 80px;
`;

const BenefitSectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;

  @media screen and (max-width: 880px) {
    gap: 1rem;
  }

  @media screen and (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  background: ${cardBgColor};
  padding: 1.5rem 1.5rem;
  border-radius: 16px;
  height: 100%;
`;

const BenefitH2 = styled.h2`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2.5rem;
`;

const BenefitTitle = styled.h4`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;

  @media screen and (max-width: 700px) {
    font-size: 24px;
  }

  @media screen and (max-width: 560px) {
    font-size: 32px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  line-height: 1.5;
  color: ${secondaryText};

  @media screen and (max-width: 700px) {
    font-size: 14px;
  }
`;

const ImgContainer = styled.div`
  width: 100%;
  margin-top: -10px;
  margin-bottom: 0.5rem;
  height: 11rem;
`;

const Img = styled.img`
  margin-right: auto;
  margin-left: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 11rem;
`;

const BenefitSection = () => {
	const { t } = useTranslation();
	return (
		<BenefitSectionContainer>
			<BenefitH2>
				{t('technologies_we_use')}
			</BenefitH2>
			<BenefitSectionWrapper>
				<BenefitCard>
					<ImgContainer>
						<ImgWrapper height={270} width={265}>
							<Img
								src={SmartLogo}
								alt={'Smart contract logo'}
							/>
						</ImgWrapper>
					</ImgContainer>
					<BenefitTitle>
						Smart contracts
					</BenefitTitle>
					<Description>
						{t('our_smart_contracts_are_verified')}
					</Description>
				</BenefitCard>
				<BenefitCard>
					<ImgContainer>
						<ImgWrapper height={270} width={265}>
							<Img
								src={PolygonLogo}
								alt={'Poligon logo'}
							/>
						</ImgWrapper>
					</ImgContainer>
					<BenefitTitle>
						Polygon network
					</BenefitTitle>
					<Description>
						{t('polygon_is_a_decentralised')}
					</Description>
				</BenefitCard>
				<BenefitCard>
					<ImgContainer>
						<ImgWrapper height={270} width={265}>
							<Img
								src={ChainLinkLogo}
								alt={'ChainLink logo'}
							/>
						</ImgWrapper>
					</ImgContainer>
					<BenefitTitle>
						Chainlink Automation
					</BenefitTitle>
					<Description>
						{t('automation_enables_conditional')}
					</Description>
				</BenefitCard>
				<BenefitCard>
					<ImgContainer>
						<ImgWrapper height={270} width={265}>
							<Img
								src={VrfLogo}
								alt={'VRF logo'}
							/>
						</ImgWrapper>
					</ImgContainer>
					<BenefitTitle>
						Chainlink VRF
					</BenefitTitle>
					<Description>
						{t('verifiable_random_function_is')}
					</Description>
				</BenefitCard>
			</BenefitSectionWrapper>
		</BenefitSectionContainer>
	);
};

export default BenefitSection;
