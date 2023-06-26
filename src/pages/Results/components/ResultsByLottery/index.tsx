import React, { MouseEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { secondaryText, text } from '../../../../constants/colors';
import { LOTTERY_LOGOS } from '../../../../constants/settings';
import { useTranslation } from 'react-i18next';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import DrawList from '../DrawList';
import CurrentLoader from '../CurrentLoader';
import Search from '../Search';
import { BackButton } from '../../../../components/Button';
import { RouteParamLotteryName } from '../../../../constants/types';

const ResultsByLotteryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopRow = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const RightIcons = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`;

const ListIcon = styled(SegmentRoundedIcon)`
  color: ${text};
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      color: ${secondaryText};
    }
  }
`;

const SearchIcon = styled(ManageSearchRoundedIcon)`
  color: ${text};
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      color: ${secondaryText};
    }
  }
`;


const NameAndLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  svg {
    height: 3rem;
    width: auto;
  }

  @media screen and (max-width: 520px) {
    svg {
      height: clamp(2.5rem, 1.375rem + 5vw, 3rem);
      width: auto;
    }
  }
`;

const Name = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${text};
  margin-left: 1rem;

  @media screen and (max-width: 520px) {
    font-size: clamp(0.9375rem, -0.3281rem + 5.625vw, 1.5rem);
  }
`;

const ResultsByLottery = () => {
		const { lotteryName } = useParams<RouteParamLotteryName>();
		const Logo = LOTTERY_LOGOS[lotteryName];
		const [isSearch, setIsSearch] = useState<boolean>(false);
		const { t } = useTranslation();
		const history = useHistory();

		useEffect(() => {
			if (!Logo) history.push('/results');
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		if (!Logo) return null;

		const toggleSearch = (e: MouseEvent<SVGSVGElement>) => {
			e.preventDefault();
			setIsSearch(prev => !prev);
		};

		return (
			<ResultsByLotteryWrapper>
				<TopRow>
					<NameAndLogoWrapper>
						<BackButton to='/results' />
						<Logo />
						<Name>
							{t(lotteryName)}
						</Name>
						<RightIcons>
							{
								isSearch
									? <ListIcon onClick={toggleSearch} />
									: <SearchIcon onClick={toggleSearch} />

							}
						</RightIcons>
					</NameAndLogoWrapper>
				</TopRow>
				<CurrentLoader>
					{
						isSearch
							? <Search />
							: <DrawList />
					}
				</CurrentLoader>
			</ResultsByLotteryWrapper>
		);
	}
;

export default ResultsByLottery;
