import React, { useState, useEffect, useContext } from 'react';
import { isMobileSafari } from 'mobile-device-detect';
import { WithChildren } from '../../constants/types';

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;

	prompt(): Promise<void>;
}

declare global {
	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}

	interface Navigator {
		standalone: boolean;
	}
}

interface PWAContextState {
	isInstalled: boolean;
	isIos: boolean;
	promptInstall: BeforeInstallPromptEvent | null;
}

export const isInstalled = (): boolean => (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);

const defaultState: PWAContextState = {
	isInstalled: isInstalled(),
	isIos: isMobileSafari,
	promptInstall: null
};

const PWAInstallContext = React.createContext<PWAContextState>(defaultState);

export const usePWAInstall = () => useContext(PWAInstallContext);

export const PWAInstallProvider: React.FC<WithChildren> = ({ children }) => {
	const [contextValue, setContextValue] = useState<PWAContextState>(defaultState);

	useEffect(() => {
		const handleBeforeInstallPromptEvent = (e: BeforeInstallPromptEvent) => {
			e.preventDefault();
			setContextValue({
				isInstalled: isInstalled(),
				isIos: isMobileSafari,
				promptInstall: e
			});
		};

		const handleInstalledPWA = (e: Event) => {
			e.preventDefault();
			setContextValue({
				isInstalled: true,
				isIos: isMobileSafari,
				promptInstall: null
			});
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPromptEvent);
		window.addEventListener('appinstalled', handleInstalledPWA);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPromptEvent);
			window.removeEventListener('appinstalled', handleInstalledPWA);
		};
	}, []);

	return (
		<PWAInstallContext.Provider value={contextValue}>
			{children}
		</PWAInstallContext.Provider>
	);
};

