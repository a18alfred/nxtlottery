import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { secondaryText } from '../../../../constants/colors';

const NoDrawsWrapper = styled.h4`
  font-size: 24px;
  text-align: center;
  color: ${secondaryText};
`;

const NoDraws = () => {
	const { t } = useTranslation();
	return (
		<NoDrawsWrapper>
			{t('no_history')}
		</NoDrawsWrapper>
	);
};

export default NoDraws;
