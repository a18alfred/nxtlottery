import { MouseEvent } from 'react';
import { TicketButton } from '../../../../components/Button';
import styled from 'styled-components';
import { lotteryColorBtn } from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import {
	selectCurrency,
	selectUserConnectionStatus,
	user_loading
} from '../../../../state/user/slice';
import Web3Utils from 'web3-utils';
import { useWeb3Modal } from '@web3modal/react';
import useTicketShop from '../../../../hooks/useTicketShop';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';
import { LotteryNameType, NumbersField } from '../../../../constants/types';
import { GLOBAL_CALC_UNIT } from '../../../../constants/settings';

const BuyButtonWrapper = styled.div`
  margin-top: 0.5rem;
`;

const SeparatorText = styled.span`
  margin: 0 0.5rem;
`;

interface BuyButtonProps {
	ticketPrice: number;
	lotteryName: LotteryNameType;
	numbersFields: NumbersField;
}

const BuyButton = ({ ticketPrice, lotteryName, numbersFields }: BuyButtonProps) => {
	const { t } = useTranslation();
	const lotteryBtnBg = lotteryColorBtn[lotteryName];
	const currency = useAppSelector(selectCurrency);
	const connected = useAppSelector(selectUserConnectionStatus);
	const { buyTicket } = useTicketShop(lotteryName);
	const { open } = useWeb3Modal();
	const dispatch = useAppDispatch();

	const onBuy = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!connected) {
			dispatch(user_loading());
			open();
		} else {
			const priceInWei = Web3Utils.toWei(ticketPrice.toString(), GLOBAL_CALC_UNIT);
			const timeStamp = Date.now();
			const field1 = numbersFields.field1.numbers;
			field1.sort((a, b) => a - b);
			const field2 = numbersFields.field2.numbers;
			field2.sort((a, b) => a - b);
			buyTicket({
				pickedNumbers: [...field1, ...field2],
				ticketValue: priceInWei,
				timeStamp: timeStamp
			});
		}
	};

	return (
		<BuyButtonWrapper>
			<TicketButton bgColor={lotteryBtnBg} onClick={onBuy}>
				{t('buy_ticket')}
				<SeparatorText>
					|
				</SeparatorText>
				{ticketPrice} {currency}
			</TicketButton>
		</BuyButtonWrapper>
	);
};

export default BuyButton;
