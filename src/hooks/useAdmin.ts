import { providerEthers, useWeb3 } from '../context/web3/web3';
import { selectUser } from '../state/user/slice';
import Web3Utils from 'web3-utils';
import { GLOBAL_CALC_UNIT } from '../constants/settings';
import { LotteryNameType } from '../constants/types';
import { useAppSelector } from '../state/hooks';

export interface NewLotteryInput {
	address: string;
	price: number;
	initialJackpot: number;
	firstDrawTime: string;
	duration: number;
}

export const useAdmin = () => {
	const { governanceInstance, randomnessInstance, lotteryInstanceByName } = useWeb3();
	const { address } = useAppSelector(selectUser);

	const getRandomnessAddress = (): string => {
		return randomnessInstance?.current?.address ? randomnessInstance.current.address : '';
	};

	const getCallbackGasLimit = async (): Promise<string> => {
		if (!randomnessInstance.current) return '';
		return (await randomnessInstance.current.callbackGasLimit()).toString();
	};

	const changeCallbackGasLimit = async ({ gasLimit }: { gasLimit: number }): Promise<void> => {
		if (!randomnessInstance.current) return;
		await randomnessInstance.current
			.changeGasLimit(gasLimit, { from: address });
	};

	const getGovernanceAddress = (): string => {
		return governanceInstance?.current?.address ? governanceInstance?.current?.address : '';
	};

	const getGovernanceAdmin = async (): Promise<string> => {
		if (!governanceInstance.current) return '';
		return await governanceInstance.current.admin();
	};

	const getGovernanceRandomness = async (): Promise<string> => {
		if (!governanceInstance.current) return '';
		return await governanceInstance.current.randomness();
	};

	const getGovernanceTickets = async (): Promise<string> => {
		if (!governanceInstance.current) return '';
		return await governanceInstance.current.tickets();
	};

	const getGovernanceLotteryFee = async (): Promise<number> => {
		if (!governanceInstance.current) return 0;
		const result = Number(await governanceInstance.current.lotteryFee());
		return result / 100;
	};

	const changeGovernanceAdmin = async ({ admin }: { admin: string }) => {
		if (governanceInstance.current)
			await governanceInstance.current
				.changeAdmin(admin, {
					from: address
				});
	};

	const changeGovernanceRandom = async ({ randomness }: { randomness: string }) => {
		if (governanceInstance.current)
			await governanceInstance.current
				.changeRandom(randomness, {
					from: address
				});
	};

	const changeGovernanceFee = async ({ fee }: { fee: number }) => {
		const newFee = fee * 100;
		if (governanceInstance.current)
			await governanceInstance.current
				.changeFee(newFee, {
					from: address
				});
	};

	const addGovernanceLottery = async (lottery: NewLotteryInput) => {
		if (!governanceInstance.current) return;
		const timeNow = Math.floor((new Date()).getTime() / 1000);
		let firstDrawDate = new Date(lottery.firstDrawTime);
		let firstDrawTime = Math.floor(firstDrawDate.getTime() / 1000);
		if (firstDrawTime <= timeNow ||
			lottery.address === '' ||
			lottery.price === 0 ||
			lottery.duration === 0 ||
			lottery.initialJackpot === 0) console.log('All fields must be filled. Draw time must be in the future.');

		const price = Web3Utils.toWei(lottery.price.toString(), GLOBAL_CALC_UNIT);
		const jackpot = Web3Utils.toWei(lottery.initialJackpot.toString(), GLOBAL_CALC_UNIT);
		const durationInSeconds = lottery.duration * 60;

		await governanceInstance.current
			.addLottery(
				lottery.address,
				price,
				durationInSeconds,
				jackpot,
				firstDrawTime,
				{
					from: address
				}
			);
	};


	const cancelLottery = async ({ addressToDelete }: { addressToDelete: string }) => {
		if (!governanceInstance.current) return;

		await governanceInstance.current
			.cancelLottery(addressToDelete, {
				from: address
			});
	};

	const getGovernanceLotteryPrice = async ({ lotteryName }: { lotteryName: LotteryNameType }): Promise<string> => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!governanceInstance.current || !lottery) return '';
		const result = await governanceInstance.current.getMinimumPrice(lottery.address);
		return Web3Utils.fromWei(result.toString(), GLOBAL_CALC_UNIT);
	};

	const getGovernanceLotteryJackpot = async ({ lotteryName }: { lotteryName: LotteryNameType }): Promise<string> => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!governanceInstance.current || !lottery) return '';

		const result = await governanceInstance.current.getInitialJackpot(lottery.address);
		return Web3Utils.fromWei(result.toString(), GLOBAL_CALC_UNIT);
	};

	const getGovernanceLotteryDuration = async ({ lotteryName }: { lotteryName: LotteryNameType }): Promise<number> => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!governanceInstance.current || !lottery) return 0;

		const result = Number(await governanceInstance.current.getDuration(lottery.address));
		return Math.floor(result / 60);
	};

	const changeGovernanceLotteryPrice = async ({ lotteryName, newPrice }:
													{ lotteryName: LotteryNameType, newPrice: number }
	) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!governanceInstance.current || !lottery) return;

		const priceInWei = Web3Utils.toWei(newPrice.toString(), GLOBAL_CALC_UNIT);
		await governanceInstance.current.changeMinimumPrice(lottery.address, priceInWei, {
			from: address
		});
	};

	const changeGovernanceLotteryJackpot = async ({ lotteryName, newJackpot }:
													  { lotteryName: LotteryNameType, newJackpot: number }
	) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!governanceInstance.current || !lottery) return;

		const priceInWei = Web3Utils.toWei(newJackpot.toString(), GLOBAL_CALC_UNIT);
		await governanceInstance.current.changeInitialJackpot(lottery.address, priceInWei, {
			from: address
		});
	};

	const changeGovernanceLotteryDuration = async ({ lotteryName, newDuration }:
													   { lotteryName: LotteryNameType, newDuration: number }
	) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!governanceInstance.current || !lottery) return;

		const durationInSeconds = newDuration * 60;
		await governanceInstance.current.changeDuration(lottery.address, durationInSeconds, {
			from: address
		});
	};

	const getGovernanceActiveLotteries = async (): Promise<string[]> => {
		if (!governanceInstance.current) return [] as string[];
		return await governanceInstance.current.getActiveLotteries();
	};

	const getLotteryAddress = async ({ lotteryName }: { lotteryName: LotteryNameType }): Promise<string> => {
		return lotteryInstanceByName.current[lotteryName].address;
	};

	const getContractBalance = async ({ address }: { address: string }): Promise<string> => {
		const balance = await providerEthers.getBalance(address);
		return Web3Utils.fromWei(balance.toString(), GLOBAL_CALC_UNIT);
	};

	const getUserBalance = async ({ lotteryName }: { lotteryName: LotteryNameType }): Promise<string> => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!lottery) return '';
		const balance = (await lottery.getUser({ from: address })).toString();
		return Web3Utils.fromWei(balance, GLOBAL_CALC_UNIT);
	};

	const getGrowingJackpot = async ({ lotteryName }: { lotteryName: LotteryNameType }): Promise<string> => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!lottery) return '';
		const growingJackpot = (await lottery.growingJackpot()).toString();
		return Web3Utils.fromWei(growingJackpot, GLOBAL_CALC_UNIT);
	};

	const lotteryToDeposit = async ({ lotteryName, value }: { lotteryName: LotteryNameType, value: number }) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!lottery) return;
		const valueInWei = Web3Utils.toWei(value.toString(), GLOBAL_CALC_UNIT);
		await lottery.deposit({
			from: address,
			value: valueInWei
		});
	};

	const lotteryToWithdraw = async ({ lotteryName, value }: { lotteryName: LotteryNameType, value: number }) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!lottery) return;
		const valueInWei = Web3Utils.toWei(value.toString(), GLOBAL_CALC_UNIT);
		await lottery.withdrawBalance(valueInWei, {
			from: address
		});
	};

	const lotteryStartNew = async ({ lotteryName }: { lotteryName: LotteryNameType }) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!lottery) return;
		await lottery.manual_start_new_lottery({ from: address });
	};

	const lotteryStartDrawing = async ({ lotteryName }: { lotteryName: LotteryNameType }) => {
		const lottery = lotteryInstanceByName.current[lotteryName];
		if (!lottery) return;
		//await lottery.fulfill_drawing_tests({ from: address })
		await lottery.manual_start_drawing({ from: address });
	};

	return {
		getRandomnessAddress,
		getGovernanceAddress,
		getLotteryAddress,
		getCallbackGasLimit,
		changeCallbackGasLimit,
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
		getGovernanceLotteryJackpot,
		changeGovernanceLotteryPrice,
		changeGovernanceLotteryDuration,
		changeGovernanceLotteryJackpot,
		addGovernanceLottery,
		getGovernanceActiveLotteries,
		getContractBalance,
		getGrowingJackpot,
		getUserBalance,
		lotteryToDeposit,
		lotteryToWithdraw,
		lotteryStartNew,
		lotteryStartDrawing
	};
};