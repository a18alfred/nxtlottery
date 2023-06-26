import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { LocaleType, SUPPORTED_LOCALES } from '../../i18nextConf';
import CheckIcon from '@mui/icons-material/Check';
import styled from 'styled-components';
import { secondaryText, text } from '../../constants/colors';
import { MenuControlItem } from './MainMenu';

interface ToggleLanguageItemProps {
	active: boolean;
}

const ToggleLanguageItem = styled.button<ToggleLanguageItemProps>`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0.5rem;
  justify-content: space-between;
  color: ${(props) => props.active ? text : secondaryText};
  text-decoration: none;
  border: none;
  outline: none;
  cursor: pointer;
  background: none;
  font-weight: 500;
  font-size: 18px;
`;

interface LanguageMenuProps {
	setIsLanguage: Dispatch<SetStateAction<boolean>>;
}

const LanguageMenu = ({ setIsLanguage }: LanguageMenuProps) => {
	const { i18n } = useTranslation();

	return (
		<>
			<MenuControlItem onClick={() => setIsLanguage(false)}>
				<ChevronLeftIcon style={{ fontSize: 24, margin: -7 }} />
			</MenuControlItem>
			{
				SUPPORTED_LOCALES.map((locale) => (
					< LanguageMenuItem
						locale={locale}
						active={i18n.language === locale.key}
						key={locale.key} />
				))
			}
		</>
	);
};

export default LanguageMenu;

interface LanguageMenuItemProps {
	locale: LocaleType;
	active: boolean;
}

const LanguageMenuItem = ({ locale, active }: LanguageMenuItemProps) => {
	const { i18n } = useTranslation();

	const changeLang = () => {
		if (active) return null;
		i18n.changeLanguage(locale.key);
	};

	return (
		<ToggleLanguageItem onClick={changeLang} active={active}>
			<div>{locale.label}</div>
			{active && <CheckIcon style={{ fontSize: 18, opacity: 0.8 }} />}
		</ToggleLanguageItem>
	);
};