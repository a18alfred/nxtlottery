import { useBalance } from 'wagmi';
import { useCurrency } from '../../hooks/useCurrency';
import styled from 'styled-components';
import { menuBreakerColor, secondaryText, text } from '../../constants/colors';
import { selectCurrency } from '../../state/user/slice';
import { useAppSelector } from '../../state/hooks';

const BalanceWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem 1.5rem 1rem;
  border-bottom: 1px solid ${menuBreakerColor};
  margin-bottom: 1rem;
`;

const CryptoBalance = styled.div`
  color: ${text};
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const UsdBalance = styled.div`
  color: ${secondaryText};
  text-align: center;
`;

interface UserBalanceProps {
	address: string;
}

const UserBalance = ({ address }: UserBalanceProps) => {
	const currency = useAppSelector(selectCurrency);
	const balance = useBalance({
		address: address as `0x${string}`,
		watch: true
	});
	const userBalance = balance.data ? parseFloat(balance.data.formatted).toFixed(4) : '0';

	const { convertToUserCurrency } = useCurrency();
	return (
		<BalanceWrapper>
			<CryptoBalance>{userBalance} {currency}</CryptoBalance>
			<UsdBalance>{convertToUserCurrency(Number(userBalance))}</UsdBalance>
		</BalanceWrapper>
	);
};

export default UserBalance;
