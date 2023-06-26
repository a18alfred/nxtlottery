import React, { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	backgroundColor,
	secondaryText,
	text
} from '../../../../constants/colors';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../../../../hooks/useAdmin';
import { AdminButton, BackButton } from '../../../../components/Button';
import { Row } from '../AdminLotteries';

const AdminRandomnessContainer = styled.div`
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

const TextSecondary = styled.span`
  color: ${secondaryText};
  margin-right: 1rem;
`;

const AddressWrapper = styled.p`
  color: ${text};
  font-weight: 500;
  font-size: 0.8rem;
`;

const HrStyled = styled.hr`
  opacity: 0.1;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const AdminRandomness = () => {
	const { t } = useTranslation();
	const {
		getRandomnessAddress,
		getCallbackGasLimit,
		changeCallbackGasLimit
	} = useAdmin();
	const address = getRandomnessAddress();
	const [randInfo, setRandInfo] = useState({
		balance: t('loading')
	});
	const [newGasLimit, setNewGasLimit] = useState<number>(0);

	const init = async () => {
		try {
			const balance = await getCallbackGasLimit();
			setRandInfo({
				balance: balance
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await changeCallbackGasLimit({
				gasLimit: newGasLimit
			});
			setNewGasLimit(0);
			await init();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<AdminRandomnessContainer>
			<TitleWrapper>
				<BackButton />
				{t('admin_/')}{t('randomness')}
			</TitleWrapper>
			<Row>
				<TextSecondary>
					{t('address')}:
				</TextSecondary>
				<AddressWrapper>
					{address}
				</AddressWrapper>
			</Row>
			<HrStyled />
			<Row>
				<TextSecondary>
					Callback gas limit:
				</TextSecondary>
				{randInfo.balance}
			</Row>
			<Row>
				<TextSecondary>
					{t('enter_new')} callback gas limit
				</TextSecondary>

			</Row>
			<Row>
				<InputStyled
					value={newGasLimit || ''}
					onChange={e => setNewGasLimit(parseInt(e.target.value) || 0)}
					type={'number'}
					placeholder={'GasLimit'}
				/>
				<AdminButton onClick={handleChange}>
					{t('change')}
				</AdminButton>
			</Row>
		</AdminRandomnessContainer>
	);
};

export default AdminRandomness;
