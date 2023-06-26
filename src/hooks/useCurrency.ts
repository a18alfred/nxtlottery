import { selectUser } from '../state/user/slice';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../state/hooks';

export const useCurrency = () => {
	const user = useAppSelector(selectUser);
	const { t } = useTranslation();

	const convertToUserCurrency = (inCrypto: number): string => {
		let result = '';
		if (user.exchange === null) return result;
		try {
			result = `${t(user.user_currency)}${(inCrypto * user.exchange[user.currency][user.user_currency]).toFixed(2)}`;
		} catch (e) {
			return '';

		}
		if (result === '0') return '';
		return result;
	};

	return { convertToUserCurrency };
};