import React, { MouseEvent } from 'react';
import styled, { withTheme } from 'styled-components';
import { secondaryText, text } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { GlowingBtn } from '../../../../components/Button';
import { useHistory } from 'react-router-dom';
import { NUMBERS_IMAGE } from '../../../../constants/settings';
import { Theme } from '../../../../context/theme/types';

const LottoDescriptionWrapper = styled.div`
  margin-top: 50px;
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
  grid-area: col2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 1rem;
  padding: 0 1rem;

  @media screen and (max-width: 880px) {
    align-items: center;
    gap: 1rem;
    padding: 0;
    max-width: 100%;
  }
`;

export const ColumnImage = styled.div`
  grid-area: col1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 880px) {
    justify-content: center;
  }
`;

const SvgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 2rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-top: 0.5rem;

  @media screen and (max-width: 880px) {
    justify-content: center;
  }
`;

const Heading = styled.h2`
  font-size: 32px;
  line-height: 1.2;
  font-weight: 800;
  color: ${text};
  width: 100%;
  text-align: left;

  @media screen and (max-width: 880px) {
    text-align: center;
    margin-bottom: 1rem;
  }
`;

const ListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-items: flex-start;
  gap: 1rem;
  list-style-type: none;

  @media screen and (max-width: 880px) {
    margin-bottom: 1rem;
  }
`;

export const ListItem = styled.li`
  position: relative;
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  color: ${secondaryText};
  text-align: left;

  &:before {
    content: '•';
    font-size: 28px;
    margin-top: -11px;
    color: ${text};
    margin-right: 1rem;
  }


`;

interface LottoDescriptionProps {
	theme: {
		mode: Theme
	};
}

const LottoDescription = ({ theme }: LottoDescriptionProps) => {
	const history = useHistory();
	const { t } = useTranslation();
	const NumberImage = NUMBERS_IMAGE[theme.mode];

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push('/lotteries');
	};

	return (
		<LottoDescriptionWrapper>
			<ColumnText>
				<Heading>
					{t('three_classic_lottery')}
				</Heading>
				<ListWrapper>
					<ListItem>
						{t('players_choose_any_combinations')}
					</ListItem>
					<ListItem>
						{t('prizes_are_won_based_on_how')}
					</ListItem>
					<ListItem>
						{t('if_a_player_matches_all')}
					</ListItem>
					<ListItem>
						{t('draw_is_rescheduled')}
					</ListItem>
				</ListWrapper>
				<ButtonWrapper>
					<GlowingBtn px={40} py={14} onClick={handleClick}>{t('buy_ticket')}</GlowingBtn>
				</ButtonWrapper>
			</ColumnText>
			<ColumnImage>
				<SvgWrapper>
					<NumberImage />
				</SvgWrapper>
			</ColumnImage>
		</LottoDescriptionWrapper>
	);
};

export default withTheme(LottoDescription);
