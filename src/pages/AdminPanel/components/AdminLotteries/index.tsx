import { Fragment, useState, useEffect, MouseEvent } from 'react';
import styled from 'styled-components';
import {
	backgroundColor,
	lotteryColorBtn,
	secondaryText,
	text
} from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../../../../hooks/useAdmin';
import { selectLottery } from '../../../../state/lottery/slice';
import { unixToDate } from '../../../../utils/helpers';
import { selectUser } from '../../../../state/user/slice';
import LotterySelector from '../../../../components/LotterySelector';
import { AdminButton, BackButton, TicketButton } from '../../../../components/Button';
import { LotteryNameType } from '../../../../constants/types';
import { useAppSelector } from '../../../../state/hooks';

type LotteryInfo = {
	address: string,
	balance: string,
	adminBalance: string,
	growingJackpot: string,
	currency: string
}

interface RowProps {
	isLast?: boolean;
}

const AdminLotteriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const TitleWrapper = styled.h2`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${text};
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const AddressWrapper = styled.p`
  color: ${text};
  font-weight: 500;
  font-size: 0.8rem;
`;

const SelectWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const Row = styled.div<RowProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-weight: 500;
  gap: 1rem;
  margin-bottom: ${({ isLast }) => (isLast ? '0.5rem' : '1rem')};
`;

const HrStyled = styled.hr`
  opacity: 0.1;
  background: ${secondaryText};
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const TextSecondary = styled.span`
  color: ${secondaryText};
  margin-right: 1rem;
`;

const InputStyled = styled.input`
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  color: ${text};
  border-radius: 12px;
  background: ${backgroundColor};
  border: 1px solid ${secondaryText};
  padding: 0.5rem 0.5rem;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  width: 10rem;
  margin-right: 1rem;

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::-webkit-input-placeholder {
    color: ${secondaryText}
  }

  ::-moz-placeholder {
    color: ${secondaryText}
  }

  :-moz-placeholder {
    color: ${secondaryText}
  }

  :-ms-input-placeholder {
    color: ${secondaryText}
  }
`;

const AdminLotteries = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const lotteries = useAppSelector(selectLottery);
	const { currency } = useAppSelector(selectUser);
	const [selectedLottery, setSelectedLottery] = useState<LotteryNameType | undefined>(undefined);
	const [toDeposit, setToDeposit] = useState<number>(0);
	const [toWithdraw, setToWithdraw] = useState<number>(0);
	const lotteryInfoInitState: LotteryInfo = {
		address: t('loading'),
		balance: t('loading'),
		adminBalance: t('loading'),
		growingJackpot: t('loading'),
		currency: ''
	};
	const [lotteryInfo, setLotteryInfo] = useState<LotteryInfo>(lotteryInfoInitState);
	const {
		getLotteryAddress,
		getContractBalance,
		getUserBalance,
		getGrowingJackpot,
		lotteryToDeposit,
		lotteryToWithdraw,
		lotteryStartNew,
		lotteryStartDrawing
	} = useAdmin();

	const init = async () => {
		try {
			if (!selectedLottery) return;
			if (lotteryInfo.address !== t('loading')) setLotteryInfo(lotteryInfoInitState);
			const address = await getLotteryAddress({ lotteryName: selectedLottery });
			const balance = await getContractBalance({ address: address });
			const adminBalance = await getUserBalance({ lotteryName: selectedLottery });
			const growingJackpot = await getGrowingJackpot({ lotteryName: selectedLottery });
			setLotteryInfo({
				address: address,
				balance: balance,
				adminBalance: adminBalance,
				growingJackpot: growingJackpot,
				currency: currency
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (selectedLottery) init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLottery]);

	const onSelected = ({ lotteryName }: { lotteryName: LotteryNameType }) => {
		if (selectedLottery !== lotteryName) {
			setSelectedLottery(lotteryName);
		}
	};

	const handleDeposit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (toDeposit === 0 || !selectedLottery) return false;
		try {
			await lotteryToDeposit({
				lotteryName: selectedLottery,
				value: toDeposit
			});
			setToDeposit(0);
			await init();
		} catch (error) {
			console.log(error);
		}
	};

	const handleWithdraw = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (toWithdraw === 0 || !selectedLottery) return false;
		try {
			await lotteryToWithdraw({
				lotteryName: selectedLottery,
				value: toWithdraw
			});
			setToWithdraw(0);
			await init();
		} catch (error) {
			console.log(error);
		}
	};

	const handleStartNewLottery = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!selectedLottery) return;
		try {
			await lotteryStartNew({ lotteryName: selectedLottery });
		} catch (error) {
			console.log(error);
		}
	};

	const handleStartDrawing = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!selectedLottery) return;
		try {
			await lotteryStartDrawing({ lotteryName: selectedLottery });
		} catch (error) {
			console.log(error);
		}
	};


	return (
		<AdminLotteriesContainer>
			<TitleWrapper>
				<BackButton />
				{t('admin_/')}{t('lotteries')}
			</TitleWrapper>
			<SelectWrapper>
				<LotterySelector onSelected={onSelected} />
			</SelectWrapper>
			{selectedLottery &&
				<Fragment>
					<Row>
						{t(selectedLottery)}
					</Row>
					<Row>
						<TextSecondary>
							{t('address')}:
						</TextSecondary>
						<AddressWrapper>
							{lotteryInfo.address}
						</AddressWrapper>
					</Row>
					<Row>
						<TextSecondary>
							{t('contract_balance')}:
						</TextSecondary>
						{lotteryInfo.balance} {lotteryInfo.currency}
					</Row>
					<Row>
						<TextSecondary>
							{t('growing_jackpot')}:
						</TextSecondary>
						{lotteryInfo.growingJackpot} {lotteryInfo.currency}
					</Row>
					<HrStyled />
					<Row>
						{t('manual_control')}
					</Row>
					{lotteries[selectedLottery].currentId === 0
						? <TicketButton bgColor={lotteryColorBtn[selectedLottery]} onClick={handleStartNewLottery}>
							{t('start_first_lottery_draw')}
						</TicketButton>
						: <Fragment>
							<TicketButton bgColor={lotteryColorBtn[selectedLottery]} onClick={handleStartDrawing}>
								{t('start_lottery_drawing')}
							</TicketButton>
							<br />
							<TextSecondary>
								{t('only_possible_to_start_drawing')}
								{unixToDate(lotteries[selectedLottery].draws[lotteries[selectedLottery].currentId].drawTime, i18n.language)}
							</TextSecondary>
						</Fragment>
					}
					<HrStyled />
					<Row>
						{t('money_management')}
					</Row>
					<Row>
						<TextSecondary>
							{t('admin_balance')}:
						</TextSecondary>
						{lotteryInfo.adminBalance} {lotteryInfo.currency}
					</Row>
					<Row>
						<TextSecondary>
							{t('enter_to_deposit')}
						</TextSecondary>
					</Row>
					<Row>
						<InputStyled
							value={toDeposit}
							onChange={e => setToDeposit(parseFloat(e.target.value) || 0)}
							type={'number'}
							placeholder={currency}
						/>
						<AdminButton onClick={handleDeposit}>
							{t('deposit')}
						</AdminButton>
					</Row>
					<Row>
						<TextSecondary>
							{t('enter_to_withdraw')}
						</TextSecondary>
					</Row>
					<Row>
						<InputStyled
							value={toWithdraw}
							onChange={e => setToWithdraw(parseFloat(e.target.value) || 0)}
							type={'number'}
							placeholder={currency}
						/>
						<AdminButton onClick={handleWithdraw}>
							{t('withdraw')}
						</AdminButton>
					</Row>
					<HrStyled />
				</Fragment>
			}
		</AdminLotteriesContainer>
	);
};

export default AdminLotteries;
