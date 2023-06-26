import React, { Fragment, MouseEvent } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { secondaryText, text } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { selectTicketError } from '../../../../state/ticket/slice';
import { GlowingBtn } from '../../../../components/Button';
import { ReactComponent as OkIcon } from '../../../../assets/images/ok.svg';
import { ReactComponent as ErrorCross } from '../../../../assets/images/error-cross.svg';
import { bottomMarginGeneral } from '../../../../context/theme/style';
import { useAppSelector } from '../../../../state/hooks';

const PurchaseDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin-bottom: ${bottomMarginGeneral};
  gap: 2rem;

  @media screen and (max-width: 880px) {
    margin-bottom: 105px;
  }
`;

const HeaderText = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${text};
  text-align: center;

  @media screen and (max-width: 520px) {
    font-size: clamp(1.5rem, 0.375rem + 5vw, 2rem);
  }
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 2rem;
  margin: 2rem 0 0 0;

  svg {
    max-height: 150px;
  }
`;

const TextSecondary = styled.p`
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  color: ${secondaryText};
  margin-bottom: 1rem;

  @media screen and (max-width: 520px) {
    font-size: clamp(1.125rem, 0.2813rem + 3.75vw, 1.5rem);
  }
`;

interface RouteParams {
	pendingId: string;
}

const PurchaseResult = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { pendingId } = useParams<RouteParams>();
	const ticketError = useAppSelector(selectTicketError);
	const error = ticketError.buyError[parseInt(pendingId)];

	const onContinue = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		history.push(`/lotteries`);
	};

	return (
		<PurchaseDetailsContainer>
			{error
				? <Fragment>
					<IconWrap>
						<ErrorCross />
					</IconWrap>
					<HeaderText>
						{t('oops')}
					</HeaderText>
					<TextSecondary>
						{t('transaction_cancelled')}
					</TextSecondary>
				</Fragment>
				: <Fragment>
					<IconWrap>
						<OkIcon />
					</IconWrap>
					<HeaderText>
						{t('thanks_for_purchase')}
					</HeaderText>
				</Fragment>
			}
			<GlowingBtn
				px={50} py={14}
				onClick={onContinue}
			>
				{t('continue_shopping')}
			</GlowingBtn>

		</PurchaseDetailsContainer>
	);
};

export default PurchaseResult;
