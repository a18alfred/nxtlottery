import { useState } from 'react';
import { LOTTERY_SETTINGS } from '../constants/settings';
import Web3Utils from 'web3-utils';
import { selectLotteryByName } from '../state/lottery/slice';
import { LotteryNameType, LotterySettings, NumbersField } from '../constants/types';
import { useAppSelector } from '../state/hooks';

const initialNumbersFieldState: NumbersField = {
	field1: {
		numbers: [],
		percent: 0
	},
	field2: {
		numbers: [],
		percent: 0
	}
};

const getRandom = (settings: LotterySettings): NumbersField => {
	const array1: number[] = [];
	const array2: number[] = [];
	const min = Math.ceil(settings.minNumber);
	const max = Math.floor(settings.maxNumber);
	while (array1.length < settings.minToPick) {
		const random = Math.floor(Math.random() * (max - min + 1)) + min;
		if (!array1.includes(random))
			array1.push(random);
	}

	if (settings.secondField !== null) {
		const min = Math.ceil(settings.secondField.minNumber);
		const max = Math.floor(settings.secondField.maxNumber);
		while (array2.length < settings.secondField.toPick) {
			const random = Math.floor(Math.random() * (max - min + 1)) + min;
			if (!array2.includes(random))
				array2.push(random);
		}
	}
	return {
		field1: {
			numbers: array1,
			percent: 100
		},
		field2: {
			numbers: array2,
			percent: 100
		}
	};
};

export const useNumbersFields = ({ isInitRandom, lotteryName }:
									 { isInitRandom: boolean, lotteryName: LotteryNameType }) => {
	const settings = LOTTERY_SETTINGS[lotteryName];
	const lotteryData = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const [numbersFields, setNumbersFields] = useState<NumbersField>(isInitRandom ? getRandom(settings) : initialNumbersFieldState);
	const [ticketPrice, setTicketPrice] = useState<number>(isInitRandom ? settings.minimumPrice : 0);

	const calcPrice = (length: number, length2?: number): boolean => {
		const currentId = lotteryData.currentId;
		if (length < settings.minToPick) {
			setTicketPrice(0);
			return false;
		}
		if (settings.secondField && length2)
			if (length2 < settings.secondField.minToPick) {
				setTicketPrice(0);
				return false;
			}
		if (currentId > 0) {
			const finalPrice = Web3Utils.fromWei(lotteryData.draws[currentId].minimumPrice.toString(), 'ether');
			setTicketPrice(parseFloat(finalPrice));
			return true;
		}

		setTicketPrice(settings.minimumPrice);
		return false;
	};

	const random = () => {
		setNumbersFields(getRandom(settings));
		calcPrice(settings.minToPick, settings.secondField?.minToPick);
	};

	const selectHandler = (number: number) => {
		let numbers = numbersFields.field1.numbers;
		const numLength = numbers.length;
		let percentage: number;
		if (!numbers.some(item => item === number)) {
			if (numLength >= settings.minToPick) return false;
			if (numLength + 1 === settings.minToPick) percentage = 100;
			else percentage = (numLength + 1) / settings.minToPick * 100;
			calcPrice(numLength + 1, numbersFields.field2.numbers.length);
			numbers = [...numbers, number];
			setNumbersFields(prev => ({
				...prev,
				field1: {
					numbers: numbers,
					percent: percentage
				}
			}));
		} else {
			percentage = (numLength - 1) / settings.minToPick * 100;
			calcPrice(numLength - 1, numbersFields.field2.numbers.length);
			numbers = numbers.filter(item => item !== number);
			setNumbersFields(prev => ({
				...prev,
				field1: {
					numbers: numbers,
					percent: percentage
				}
			}));
		}
	};

	const selectHandlerSecondField = (number: number) => {
		if (!settings.secondField) return;
		let numbers = numbersFields.field2.numbers;
		const numLength = numbers.length;
		let percentage: number;
		if (!numbers.some(item => item === number)) {
			if (numLength >= settings.secondField.minToPick) return false;
			if (numLength + 1 === settings.secondField.minToPick) percentage = 100;
			else percentage = (numLength + 1) / settings.secondField.minToPick * 100;
			calcPrice(numbersFields.field1.numbers.length, numLength + 1);
			numbers = [...numbers, number];
			setNumbersFields(prev => ({
				...prev,
				field2: {
					numbers: numbers,
					percent: percentage
				}
			}));
		} else {
			percentage = (numLength - 1) / settings.secondField.minToPick * 100;
			calcPrice(numbersFields.field1.numbers.length, numLength - 1);
			numbers = numbers.filter(item => item !== number);
			setNumbersFields(prev => ({
				...prev,
				field2: {
					numbers: numbers,
					percent: percentage
				}
			}));
		}
	};

	const reset = () => {
		setNumbersFields(initialNumbersFieldState);
		setTicketPrice(0);
	};

	return { numbersFields, reset, random, ticketPrice, selectHandler, selectHandlerSecondField };
};