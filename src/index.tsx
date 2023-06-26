import { createRoot } from 'react-dom/client';
import 'inter-ui';
import { Provider } from 'react-redux';
import './i18nextConf';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { MainThemeProvider } from './context/theme/theme';
import Web3Provider from './context/web3/web3';
import { HelmetProvider } from 'react-helmet-async';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { BrowserRouter } from 'react-router-dom';
import { PWAInstallProvider } from './context/pwa/pwa';
import { ThemedGlobalStyle } from './context/theme/style';
import store from './state';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
const helmetContext = {};

//************

const projectId: string = process.env.REACT_APP_WALLETCONNECT_ID as string;

const chains = [polygonMumbai];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, version: 1, chains }),
	provider
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);

const app = document.getElementById('app');
if (!app) throw new Error('Failed to find the app element');
const root = createRoot(app);

root.render(
	<Provider store={store}>
		<WagmiConfig client={wagmiClient}>
			<BrowserRouter>
				<Web3Provider>
					<HelmetProvider context={helmetContext}>
						<MainThemeProvider>
							<ThemedGlobalStyle />
							<PWAInstallProvider>
								<App />
							</PWAInstallProvider>
						</MainThemeProvider>
					</HelmetProvider>
				</Web3Provider>
			</BrowserRouter>
		</WagmiConfig>
		<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
	</Provider>
);

serviceWorkerRegistration.register({});
