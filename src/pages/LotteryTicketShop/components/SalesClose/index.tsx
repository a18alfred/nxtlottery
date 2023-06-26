import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { secondaryText, text } from '../../../../constants/colors';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ClockIcon } from '../../../../assets/images/clock.svg';
import { GlowingBtn } from '../../../../components/Button';

const SalesCloseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin-bottom: 40px;

  @media screen and (max-width: 880px) {
    button {
      display: none;
    }
  }
`;

export const ImgWrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
  margin-bottom: 2rem;

  svg {
    max-height: 150px;
  }
`;

export const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 920px;
  margin-bottom: 3rem;

  @media screen and (max-width: 880px) {
    margin-bottom: 0;
  }
`;

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${text};
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;

  @media screen and (max-width: 520px) {
    font-size: 24px;
  }
`;

const Line = styled.p`
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  line-height: 1.5;
  white-space: pre-line;
  color: ${secondaryText};

  @media screen and (max-width: 520px) {
    font-size: 18px;
  }
`;

const SalesClose = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const onMyTickets = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push(`/tickets`);
	};

	return (
		<SalesCloseWrapper>
			<ImgWrap>
				<ClockIcon />
			</ImgWrap>
			<TextWrapper>
				<Heading>{t('sales_closed')}</Heading>
				<Line>{t('ticket_sales_close_5')}</Line>
			</TextWrapper>
			<GlowingBtn px={65} py={14} onClick={onMyTickets}>
				{t('my_tickets')}
			</GlowingBtn>
		</SalesCloseWrapper>
	);
};

export default SalesClose;
