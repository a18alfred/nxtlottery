import React from 'react';
import { LOTTERY_SETTINGS } from '../../../../constants/settings';
import styled from 'styled-components';
import {
	text,
	secondaryText,
	cardBgColor,
	lotteryColorBtn
} from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import WinInfo from '../WinInfo';
import { useQuery } from '../../../../hooks/useQuery';
import { useNumbersFields } from '../../../../hooks/useNumbersFields';
import { BtnWrapperWithTooltip } from '../../../../components/Button';
import ProgressBar from '../../../../components/ProgressBar';
import BuyButton from '../BuyButton';
import NumberSelector from '../NumberSelector';
import { useParams } from 'react-router-dom';
import { RouteParamLotteryName } from '../../../../constants/types';

const TicketPickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 1.5rem;
  background: ${cardBgColor};
  margin-bottom: 1rem;
  gap: 1rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: -0.5rem;
`;

const HeaderTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  font-weight: 800;
  color: ${text};
`;

const InfoText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${secondaryText};
`;

const InfoTextSmall = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${secondaryText};
`;

const ButtonsWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TicketPicker = () => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const query = useQuery();
	const settings = LOTTERY_SETTINGS[lotteryName];
	const lotteryBtnBg = lotteryColorBtn[lotteryName];
	const { t } = useTranslation();
	const {
		numbersFields,
		ticketPrice,
		reset,
		random,
		selectHandler,
		selectHandlerSecondField
	} = useNumbersFields({
		isInitRandom: !!query?.get('random'),
		lotteryName: lotteryName
	});

	const ticketReady = settings.secondField === null ? numbersFields.field1.numbers.length >= settings.minToPick
		: (numbersFields.field1.numbers.length >= settings.minToPick && numbersFields.field2.numbers.length === settings.secondField.toPick);

	return (
		<>
			<TicketPickerWrapper>
				<TopRow>
					<HeaderTitle>
						{t('ticket')}
					</HeaderTitle>
					<ButtonsWrap>
						<BtnWrapperWithTooltip onClick={random}>
							<CasinoOutlinedIcon style={{ fontSize: 32, margin: -7 }} />
							<div>
								{t('generate')}
							</div>
						</BtnWrapperWithTooltip>
						<BtnWrapperWithTooltip onClick={reset}>
							<ClearIcon style={{ fontSize: 32, margin: -7 }} />
							<div>
								{t('clear')}
							</div>
						</BtnWrapperWithTooltip>
					</ButtonsWrap>
				</TopRow>
				<InfoText>
					{t(`pick_numbers_${lotteryName}`)}
				</InfoText>

				{settings.secondField !== null &&
					<InfoTextSmall>
						{t('field')} 1
					</InfoTextSmall>
				}
				<ProgressBar percentage={numbersFields.field1.percent} lineColor={lotteryBtnBg} />
				<NumberSelector
					selectHandler={selectHandler}
					isSecondField={false}
					numbersFields={numbersFields}
				/>

				{settings.secondField !== null &&
					<>
						<InfoTextSmall>
							{t('field')} 2
						</InfoTextSmall>
						<ProgressBar percentage={numbersFields.field2.percent} lineColor={lotteryBtnBg} />
						<NumberSelector
							selectHandler={selectHandlerSecondField}
							isSecondField={true}
							numbersFields={numbersFields}
						/>
					</>
				}

				{ticketReady &&
					<BuyButton
						ticketPrice={ticketPrice}
						lotteryName={lotteryName}
						numbersFields={numbersFields}
					/>}
			</TicketPickerWrapper>
			<WinInfo />
		</>
	);
};

export default TicketPicker;
