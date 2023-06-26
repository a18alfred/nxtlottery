import {
	selectUserAddress,
	selectUserChainName,
	selectUserConnectionStatus
} from '../../state/user/slice';
import { truncate } from '../../utils/helpers';
import { BtnWithBorderAndTooltip } from '../Button';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import UserBalance from '../UserBalance';
import styled from 'styled-components';
import { secondaryText, text } from '../../constants/colors';
import { disconnectUser } from '../../context/web3/web3';
import { useTranslation } from 'react-i18next';
import { useClipboard } from 'use-clipboard-copy';
import { useCallback, useState, Dispatch, MouseEvent, SetStateAction } from 'react';
import { useAppSelector } from '../../state/hooks';
import IdIcon from '../IdIcon';

const AccountInfoRow = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 0.5rem 0 0.5rem;
  justify-content: space-between;
  color: ${text};
  font-size: 1rem;
`;

const TextSmall = styled.div`
  width: 100%;
  padding: 0.5rem 0.5rem;
  color: ${secondaryText};
  font-size: 12px;
  margin-top: -0.5rem;
`;

const AccountAddress = styled.span`
  font-size: 1.25rem;
`;

const RowRightPart = styled.div`
  display: flex;
  align-items: center;
`;

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

interface AccountInfoProps {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AccountInfo = ({ setIsOpen }: AccountInfoProps) => {
	const { t } = useTranslation();
	const address = useAppSelector(selectUserAddress);
	const connected = useAppSelector(selectUserConnectionStatus);
	const chainName = useAppSelector(selectUserChainName);
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const clipboard = useClipboard();

	const onDisconnect = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsOpen(false);
		disconnectUser();
	};

	const onCopy = useCallback(
		() => {
			clipboard.copy(address);
			setIsCopied(true);
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);

		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[clipboard.copy, address]
	);

	if (!connected) return null;
	return (
		<>
			<AccountInfoRow>
				<AddressWrapper>
					<IdIcon address={address} />
					<AccountAddress>
						{truncate(address, 13)}
					</AccountAddress>
				</AddressWrapper>
				<RowRightPart>
					<BtnWithBorderAndTooltip px={5} py={5} onClick={onCopy}>
						{
							isCopied
								? <CheckIcon style={{ fontSize: 18, margin: 0 }} />
								: <ContentCopyIcon style={{ fontSize: 16, margin: 1 }} />
						}
						<div>
							{t('copy')}
						</div>
					</BtnWithBorderAndTooltip>
					<BtnWithBorderAndTooltip px={5} py={5} onClick={onDisconnect}>
						<PowerSettingsNewIcon style={{ fontSize: 18 }} />
						<div>
							{t('disconnect')}
						</div>
					</BtnWithBorderAndTooltip>
				</RowRightPart>
			</AccountInfoRow>
			<TextSmall>
				{chainName}
			</TextSmall>
			<UserBalance address={address} />
		</>
	);
};

export default AccountInfo;
