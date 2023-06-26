import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LotterySelector from '../../../../components/LotterySelector';
import styled from 'styled-components';
import { text } from '../../../../constants/colors';
import { LotteryNameType } from '../../../../constants/types';

const ResultsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.h2`
  color: ${text};
  font-weight: 800;
  font-size: 24px;
`;

const ResultsSelector = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const onSelected = ({ lotteryName }: { lotteryName: LotteryNameType }) => {
		history.push(`results/${lotteryName}`);
	};

	return (
		<ResultsSelectorWrapper>
			<Header>
				{t('select_lottery')}
			</Header>

			<LotterySelector onSelected={onSelected} />
		</ResultsSelectorWrapper>
	);
};

export default ResultsSelector;
