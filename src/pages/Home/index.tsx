import React from 'react';
import styled from 'styled-components';
import HeroSection from './components/HeroSection';
import BenefitSection from './components/BenefitSection';
import LottoDescription from './components/LottoDescription';
import { bottomMarginHome } from '../../context/theme/style';

export const HomeContainer = styled.div`
  margin-top: 60px;
  margin-bottom: ${bottomMarginHome};

  @media screen and (max-width: 880px) {
    margin-top: 40px;
  }
`;

const Home = () => {
	return (
		<HomeContainer>
			<HeroSection />
			<BenefitSection />
			<LottoDescription />
		</HomeContainer>
	);
};

export default Home;
