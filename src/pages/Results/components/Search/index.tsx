import React, { ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { selectLotteryByName } from '../../../../state/lottery/slice';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import styled from 'styled-components';
import { cardBgColor, secondaryText, text } from '../../../../constants/colors';
import SearchIcon from '@mui/icons-material/Search';
import SearchLoader from '../SearchLoader';
import DrawInfo from '../DrawInfo';
import useLotteryFetch from '../../../../hooks/useLotteryFetch';
import { useAppSelector } from '../../../../state/hooks';
import { RouteParamLotteryName } from '../../../../constants/types';

const FormStyled = styled.form`
  display: flex;
  width: 100%;
  background: ${cardBgColor};
  border-radius: 24px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InputStyled = styled.input`

  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  color: ${text};
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  border: none;
  width: 100%;

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::placeholder {
    ${secondaryText};
    font-size: clamp(0.875rem, 0.125rem + 3.3333vw, 1rem);
  }
`;

const ButtonWrapper = styled.button`
  border: none;
  outline: none;
  background: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${text};

  @media (hover: hover) {
    :hover {
      color: ${secondaryText};
    }
  }
`;

const DrawWrapper = styled.ul`
  width: 100%;
`;

const Search = () => {
	const { lotteryName } = useParams<RouteParamLotteryName>();
	const lottery = useAppSelector(state => selectLotteryByName(state, lotteryName));
	const { t } = useTranslation();
	const lastDraw = lottery.currentId - 1;
	const placeholder = t('search_by_draw') + lastDraw;
	const [inputDraw, setInputDraw] = useState<number>(0);
	const [selectedDraw, setSelectedDraw] = useState(0);
	const { resultById } = useLotteryFetch(lottery.lotteryName);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isNaN(+inputDraw) || inputDraw === 0 || inputDraw > lastDraw || inputDraw <= 0) {
			setInputDraw(0);
			return;
		}

		if (!(inputDraw in lottery.draws)) {
			await resultById(inputDraw);
		}
		setSelectedDraw(Number(inputDraw));
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const re = /^[0-9\b]+$/;
		const value = e.target.value;
		if (value === '' || re.test(value)) {
			setInputDraw(parseInt(value) || 0);
		}
		if (value === '') setSelectedDraw(0);
	};

	return (
		<>
			<FormStyled onSubmit={handleSubmit}>
				<InputStyled
					value={inputDraw || ''}
					onChange={handleChange}
					type={'number'}
					placeholder={placeholder}
				/>
				<ButtonWrapper>
					<SearchIcon />
				</ButtonWrapper>
			</FormStyled>
			<SearchLoader isLoading={lottery.isLoading} draw={lottery.draws[selectedDraw]}>
				<DrawWrapper>
					<DrawInfo draw={lottery.draws[selectedDraw]} />
				</DrawWrapper>
			</SearchLoader>
		</>
	);
};

export default Search;
