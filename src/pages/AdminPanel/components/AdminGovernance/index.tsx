import React, { MouseEvent, ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	backgroundColor,
	secondaryText,
	text
} from '../../../../constants/colors';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NewLotteryInput, useAdmin } from '../../../../hooks/useAdmin';
import { getAdmin, selectUser } from '../../../../state/user/slice';
import { useWeb3 } from '../../../../context/web3/web3';
import AdminActiveLotteries from '../AdminActiveLotteries';
import LotterySelector from '../../../../components/LotterySelector';
import { AdminButton, BackButton } from '../../../../components/Button';
import { Row } from '../AdminLotteries';
import { LotteryNameType } from '../../../../constants/types';
import { useAppDispatch, useAppSelector } from '../../../../state/hooks';

const AdminGovernanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const LotterySettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 1rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
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

const InputStyled = styled.input`
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  color: ${text};
  border-radius: 12px;
  background: ${backgroundColor};
  background-color: ${backgroundColor};
  border: 1px solid ${secondaryText};
  padding: 0.5rem 0.5rem;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  width: 30rem;
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

const TextSecondary = styled.span`
  color: ${secondaryText};
  margin-right: 1rem;
`;

const HrStyled = styled.hr`
  opacity: 0.1;
  background: ${secondaryText};
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const HrStyledSmall = styled.hr`
  opacity: 0.1;
  background: ${secondaryText};
  width: 100%;
  margin-bottom: 1rem;
`;

const SelectWrapper = styled.div`
  margin-bottom: 1rem;
`;

const AddressWrapper = styled.p`
  color: ${text};
  font-weight: 500;
  font-size: 0.8rem;
`;

const newLotteryInitialState = {
	address: '',
	price: 0,
	duration: 0,
	initialJackpot: 0,
	firstDrawTime: ''
};

const AdminGovernance = () => {
	const history = useHistory();
	const { currency } = useAppSelector(selectUser);
	const { t } = useTranslation();
	const { governanceInstance } = useWeb3();
	const dispatch = useAppDispatch();
	const {
		getGovernanceAddress,
		getGovernanceAdmin,
		getGovernanceRandomness,
		getGovernanceTickets,
		getGovernanceLotteryFee,
		changeGovernanceAdmin,
		changeGovernanceRandom,
		changeGovernanceFee,
		cancelLottery,
		getGovernanceLotteryPrice,
		getGovernanceLotteryDuration,
		changeGovernanceLotteryJackpot,
		changeGovernanceLotteryPrice,
		changeGovernanceLotteryDuration,
		addGovernanceLottery,
		getGovernanceActiveLotteries,
		getGovernanceLotteryJackpot
	} = useAdmin();
	const address = getGovernanceAddress();
	const [governanceSettings, setGovernanceSettings] = useState({
		admin: t('loading'),
		randomness: t('loading'),
		tickets: t('loading'),
		lotteryFee: t('loading'),
		actives: [] as string[]
	});
	const [newAdmin, setNewAdmin] = useState<string>('');
	const [newRandomness, setNewRandomness] = useState<string>('');
	const [newFee, setNewFee] = useState<number>(0);
	const [lotteryToDelete, setLotteryToDelete] = useState<string>('');
	const [selectedLottery, setSelectedLottery] = useState<LotteryNameType | undefined>(undefined);
	const initialLotterySettings = {
		minimumPrice: t('loading'),
		duration: t('loading'),
		initialJackpot: t('loading')
	};
	const [lotterySettings, setLotterySettings] = useState(initialLotterySettings);
	const [newTicketPrice, setNewTicketPrice] = useState<number>(0);
	const [newDuration, setNewDuration] = useState<number>(0);
	const [newJackpot, setNewJackpot] = useState<number>(0);
	const [newLottery, setNewLottery] = useState<NewLotteryInput>(newLotteryInitialState);

	const init = async () => {
		try {
			const actives = await getGovernanceActiveLotteries();
			const admin = await getGovernanceAdmin();
			const randomness = await getGovernanceRandomness();
			const tickets = await getGovernanceTickets();
			const lotteryFee = await getGovernanceLotteryFee();
			setGovernanceSettings({
				admin: admin,
				randomness: randomness,
				tickets: tickets,
				lotteryFee: lotteryFee.toString(),
				actives: actives
			});
		} catch (error) {
			console.log(error);
		}
	};

	const initLotterySettings = async () => {
		if (!selectedLottery) return;
		try {
			if (lotterySettings.minimumPrice !== t('loading')) {
				setLotterySettings(initialLotterySettings);
			}
			const price = await getGovernanceLotteryPrice({
				lotteryName: selectedLottery
			});

			const duration = await getGovernanceLotteryDuration({
				lotteryName: selectedLottery
			});
			const initialJackpot = await getGovernanceLotteryJackpot({
				lotteryName: selectedLottery
			});

			setLotterySettings({
				minimumPrice: price,
				duration: duration.toString(),
				initialJackpot: initialJackpot
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedLottery) initLotterySettings();
		setNewTicketPrice(0);
		setNewJackpot(0);
		setNewDuration(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLottery]);

	const handleAdminChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!governanceInstance.current) return;
		try {
			await changeGovernanceAdmin({
				admin: newAdmin
			});
			setNewAdmin('');
			dispatch(getAdmin({
				governanceInstance: governanceInstance.current
			}));
			history.push('/');
		} catch (error) {
			console.log(error);
			setNewAdmin('');
		}
	};

	const handleRandomnessChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await changeGovernanceRandom({
				randomness: newRandomness
			});
			setNewRandomness('');
			await init();
		} catch (error) {
			console.log(error);
			setNewRandomness('');
		}
	};

	const handleFeeChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await changeGovernanceFee({
				fee: newFee
			});
			setNewFee(0);
			await init();
		} catch (error) {
			console.log(error);
			setNewFee(0);
		}
	};

	const handleFeeInput = (e: ChangeEvent<HTMLInputElement>) => {
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setNewFee(parseInt(e.target.value) || 0);
		}
	};

	const handleDurationInput = (e: ChangeEvent<HTMLInputElement>) => {
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setNewDuration(parseInt(e.target.value) || 0);
		}
	};

	const handleDurationNewLotteryInput = (e: ChangeEvent<HTMLInputElement>) => {
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setNewLottery(prevState => ({ ...prevState, duration: parseInt(e.target.value) || 0 }));
		}
	};

	const handleDeleteLottery = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await cancelLottery({
				addressToDelete: lotteryToDelete
			});
			await init();
			console.log(`Lotttery (${lotteryToDelete}) is deleted`);
			setLotteryToDelete('');
		} catch (error) {
			console.log(error);
			setLotteryToDelete('');
		}
	};

	const handlePriceChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!selectedLottery) return;
		try {
			await changeGovernanceLotteryPrice({
				lotteryName: selectedLottery,
				newPrice: newTicketPrice
			});
			setNewTicketPrice(0);
			initLotterySettings();
		} catch (error) {
			console.log(error);
			setNewTicketPrice(0);
		}
	};

	const handleDurationChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!selectedLottery) return;
		try {
			await changeGovernanceLotteryDuration({
				lotteryName: selectedLottery,
				newDuration: newDuration
			});
			setNewDuration(0);
			initLotterySettings();
		} catch (error) {
			console.log(error);
			setNewDuration(0);
		}
	};

	const handleJackpotChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!selectedLottery) return;
		try {
			await changeGovernanceLotteryJackpot({
				lotteryName: selectedLottery,
				newJackpot: newJackpot
			});
			setNewJackpot(0);
			initLotterySettings();
		} catch (error) {
			console.log(error);
			setNewJackpot(0);
		}
	};

	const handleAddLottery = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await addGovernanceLottery(newLottery);
			await init();
			setNewLottery(newLotteryInitialState);
			console.log('The new lottery is added');
		} catch (error) {
			console.log(error);
		}
	};

	const onSelected = ({ lotteryName }: { lotteryName: LotteryNameType }) => {
		if (selectedLottery !== lotteryName) {
			setSelectedLottery(lotteryName);
		}
	};

	return (
		<AdminGovernanceContainer>
			<TitleWrapper>
				<BackButton />
				{t('admin_/')}{t('governance')}
			</TitleWrapper>
			<Row>
				<TextSecondary>
					{t('address')}:
				</TextSecondary>
				<AddressWrapper>
					{address}
				</AddressWrapper>
			</Row>
			<Row>
				<TextSecondary>
					{t('tickets_address')}:
				</TextSecondary>
				<AddressWrapper>
					{governanceSettings.tickets}
				</AddressWrapper>
			</Row>
			<HrStyled />
			<Row>
				{t('lottery_settings')}
			</Row>

			<Row>
				<TextSecondary>
					{t('lottery_fee')}:
				</TextSecondary>
				{governanceSettings.lotteryFee}%
			</Row>
			<Row>
				<TextSecondary>
					{t('enter_new_lottery_fee')}
				</TextSecondary>
			</Row>
			<Row>
				<InputStyled
					value={newFee || ''}
					onChange={handleFeeInput}
					type='number'
					placeholder={'%'}
				/>
				<AdminButton onClick={handleFeeChange}>
					{t('change')}
				</AdminButton>
			</Row>
			<HrStyled />
			<Row>
				{t('adding_lottery')}
			</Row>
			<form action=''>
				<Row>
					<TextSecondary>
						{t('contract_address')}
					</TextSecondary>
				</Row>
				<Row>
					<InputStyled
						value={newLottery.address}
						onChange={e => setNewLottery(prevState => ({ ...prevState, address: e.target.value }))}
						type='text'
						placeholder={t('address')}
						required
					/>
				</Row>
				<Row>
					<TextSecondary>
						{t('ticket_price')}
					</TextSecondary>
				</Row>
				<Row>
					<InputStyled
						value={newLottery.price}
						onChange={e => setNewLottery(prevState => ({
							...prevState,
							price: parseFloat(e.target.value) || 0
						}))}
						type='number'
						placeholder={currency}
						required
					/>
				</Row>
				<Row>
					<TextSecondary>
						{t('minutes_between_draws')}
					</TextSecondary>
				</Row>
				<Row>
					<InputStyled
						value={newLottery.duration}
						onChange={e => handleDurationNewLotteryInput(e)}
						type='number'
						placeholder={t('minutes')}
						required
					/>
				</Row>
				<Row>
					<TextSecondary>
						{t('initial_jackpot')}
					</TextSecondary>
				</Row>
				<Row>
					<InputStyled
						value={newLottery.initialJackpot}
						onChange={e => setNewLottery(prevState => ({
							...prevState,
							initialJackpot: parseFloat(e.target.value) || 0
						}))}
						type='number'
						placeholder={currency}
						required
					/>
				</Row>
				<Row>
					<TextSecondary>
						{t('date_first_draw')}
					</TextSecondary>
				</Row>
				<Row>
					<InputStyled
						value={newLottery.firstDrawTime}
						onChange={e => setNewLottery(prevState => ({ ...prevState, firstDrawTime: e.target.value }))}
						type='datetime-local'
						placeholder={t('date')}
						required
					/>
				</Row>
				<Row>
					<AdminButton type='submit' onClick={handleAddLottery}>
						{t('add')}
					</AdminButton>
				</Row>
			</form>


			<HrStyled />
			<Row>
				{t('deleting_lottery')}
			</Row>
			<Row>
				<TextSecondary>
					{t('enter_lottery_to_delete')}
				</TextSecondary>
			</Row>
			<Row>
				<InputStyled
					value={lotteryToDelete}
					onChange={e => setLotteryToDelete(e.target.value)}
					type='text'
					placeholder={t('address')}
				/>
				<AdminButton onClick={handleDeleteLottery}>
					{t('delete')}
				</AdminButton>
			</Row>
			<HrStyled />
			<Row>
				<TextSecondary>
					{t('randomness_address')}:
				</TextSecondary>
				<AddressWrapper>
					{governanceSettings.randomness}
				</AddressWrapper>
			</Row>
			<Row>
				<TextSecondary>
					{t('enter_new_randomness')}
				</TextSecondary>
			</Row>
			<Row>
				<InputStyled
					value={newRandomness}
					onChange={e => setNewRandomness(e.target.value)}
					type='text'
					placeholder={t('address')}
				/>
				<AdminButton onClick={handleRandomnessChange}>
					{t('change')}
				</AdminButton>
			</Row>
			<HrStyled />
			<Row>
				<TextSecondary>
					{t('admin_address')}
				</TextSecondary>
				<AddressWrapper>
					{governanceSettings.admin}
				</AddressWrapper>
			</Row>
			<Row>
				<TextSecondary>
					{t('enter_new_admin')}
				</TextSecondary>
			</Row>
			<Row>
				<InputStyled
					value={newAdmin}
					onChange={e => setNewAdmin(e.target.value)}
					type='text'
					placeholder={t('address')}
				/>
				<AdminButton onClick={handleAdminChange}>
					{t('change')}
				</AdminButton>
			</Row>
			<HrStyled />
			<Row>
				{t('list_of_active_lotteries')}
			</Row>
			<AdminActiveLotteries actives={governanceSettings.actives} />
			<HrStyled />
			<SelectWrapper>
				<LotterySelector onSelected={onSelected} />
			</SelectWrapper>
			{selectedLottery &&
				<LotterySettingsContainer>
					<Row>
						{t(selectedLottery)}
					</Row>
					<Row>
						<TextSecondary>
							{t('ticket_price')}:
						</TextSecondary>
						{lotterySettings.minimumPrice} {currency}
					</Row>
					<Row>
						<TextSecondary>
							{t('enter_new_ticket_price')}
						</TextSecondary>
					</Row>
					<Row>
						<InputStyled
							value={newTicketPrice}
							onChange={e => setNewTicketPrice(parseFloat(e.target.value) || 0)}
							type='number'
							placeholder={currency}
						/>
						<AdminButton onClick={handlePriceChange}>
							{t('change')}
						</AdminButton>
					</Row>
					<HrStyledSmall />
					<Row>
						<TextSecondary>
							{t('minutes_between_draws')}:
						</TextSecondary>
						{lotterySettings.duration}
					</Row>
					<Row>
						<TextSecondary>
							{t('enter_new_duration')}
						</TextSecondary>
					</Row>
					<Row>
						<InputStyled
							value={newDuration}
							onChange={e => handleDurationInput(e)}
							type='number'
							placeholder={t('minutes')}
						/>
						<AdminButton onClick={handleDurationChange}>
							{t('change')}
						</AdminButton>
					</Row>
					<HrStyledSmall />
					<Row>
						<TextSecondary>
							{t('initial_jackpot')}:
						</TextSecondary>
						{lotterySettings.initialJackpot}
					</Row>
					<Row>
						<TextSecondary>
							{t('enter_new_initial_jackpot')}
						</TextSecondary>
					</Row>
					<Row>
						<InputStyled
							value={newJackpot}
							onChange={e => setNewJackpot(parseFloat(e.target.value) || 0)}
							type='number'
							placeholder={currency}
						/>
						<AdminButton onClick={handleJackpotChange}>
							{t('change')}
						</AdminButton>
					</Row>
				</LotterySettingsContainer>
			}
		</AdminGovernanceContainer>
	);
};

export default AdminGovernance;
