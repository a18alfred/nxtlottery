import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { backgroundColorManual } from '../../constants/colors';
import { useWeb3ModalTheme } from '@web3modal/react';
import { Helmet } from 'react-helmet-async';
import { Theme } from './types';
import { WithChildren } from '../../constants/types';

interface ThemeContextProps {
	toggle: () => void;
}

const backgroundMainColorElement = document.getElementById('background-main-color') as HTMLElement;

const localTheme = window.localStorage.getItem('nxtlottery_theme');
const initialTheme = localTheme ? localTheme : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
backgroundMainColorElement.style.background = initialTheme === 'light' ? `#FFFFFF` : `#141416`;

const ThemeToggleContext = React.createContext<ThemeContextProps | undefined>(undefined);

export const MainThemeProvider: React.FC<WithChildren> = ({ children }) => {
	const { setTheme } = useWeb3ModalTheme();
	const [themeState, setThemeState] = useState<Theme>(initialTheme as Theme);

	const setMode = (mode: Theme) => {
		backgroundMainColorElement.style.background = mode === 'light' ? `#FFFFFF` : `#141416`;
		window.localStorage.setItem('nxtlottery_theme', mode);
		setThemeState(mode);
	};

	const toggle = () => {
		const mode = (themeState === 'light' ? `dark` : `light`);
		setMode(mode);
	};

	useEffect(() => {
		setTheme({ themeMode: themeState });
	}, [setTheme, themeState]);

	return (
		<ThemeToggleContext.Provider value={{ toggle: toggle }}>
			<ThemeProvider
				theme={{
					mode: themeState
				}}
			>
				{children}
				<Helmet>
					<meta name='theme-color'
						  content={themeState === 'light' ? backgroundColorManual.light : backgroundColorManual.dark} />
				</Helmet>
			</ThemeProvider>
		</ThemeToggleContext.Provider>
	);
};

export const useTheme = (): ThemeContextProps => {
	const context = React.useContext(ThemeToggleContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeToggleProvider');
	}
	return context;
};

