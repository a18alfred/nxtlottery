import React, { Dispatch, SetStateAction, useState } from 'react';
import LanguageMenu from './LanguageMenu';
import MainMenu from './MainMenu';

interface MenuSelectorProps {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MenuSelector = ({ setIsOpen }: MenuSelectorProps) => {
	const [isLanguage, setIsLanguage] = useState<boolean>(false);

	if (isLanguage) return (
		<LanguageMenu setIsLanguage={setIsLanguage} />
	);

	return (
		<MainMenu setIsOpen={setIsOpen} setIsLanguage={setIsLanguage} />
	);
};

export default MenuSelector;
