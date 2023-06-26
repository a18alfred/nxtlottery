import React, { useEffect, useRef } from 'react';
import {
	user_disconnected,
	user_connected,
	selectUser,
	getAdmin, update_exchangeRate
} from '../../state/user/slice';
import { fetchLotteryCurrentId } from '../../state/lottery/slice';
import { fetchUserTickets, ticket_reset } from '../../state/ticket/slice';
import { LOTTERY_NAMES, GLOBAL_SETTINGS } from '../../constants/settings';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import Lottery645 from '../../abis/Lottery645.json';
import Lottery749 from '../../abis/Lottery749.json';
import Lottery420 from '../../abis/Lottery420.json';
import Tickets from '../../abis/Tickets.json';
import Governance from '../../abis/Governance.json';
import Randomness from '../../abis/Randomness.json';
import { ethereumClient } from '../../index';
import { useHistory } from 'react-router-dom';
import { LotteryInstanceByName, LotteryNameByAddress, Network, Web3ContextState } from './types';
import { getCoinPrices } from '../../utils/coins';
import { Contract } from '@ethersproject/contracts';
import { WithChildren } from '../../constants/types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';

const lot645networks: Network = Lottery645.networks;
const lot749networks: Network = Lottery749.networks;
const lot420networks: Network = Lottery420.networks;
const ticketNetworks: Network = Tickets.networks;
const govNetworks: Network = Governance.networks;
const randNetworks: Network = Randomness.networks;

const { ethers } = require('ethers');
export const providerEthers = new ethers.providers.EtherscanProvider('maticmum', process.env.REACT_APP_ETHERSCAN_KEY);

const defaultState: Web3ContextState = {
	ticketsInstance: {
		current: undefined
	},
	governanceInstance: {
		current: undefined
	},
	randomnessInstance: {
		current: undefined
	},
	lotteryNameByAddress: {
		current: {}
	},
	lotteryInstanceByName: {
		current: {}
	},
	lotteryInstanceByNameReadOnly: {
		current: {}
	}
};

export const Web3Context = React.createContext<Web3ContextState>(defaultState);

export const useWeb3 = () => React.useContext(Web3Context);

export const disconnectUser = async () => {
	try {
		await ethereumClient.disconnect();
	} catch (error) {
		console.log(error);
	}
};

const Web3Provider: React.FC<WithChildren> = ({ children }) => {
	const history = useHistory();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const governanceInstance = useRef<Contract | undefined>(defaultState.governanceInstance.current);
	const randomnessInstance = useRef<Contract | undefined>(defaultState.randomnessInstance.current);
	const ticketsInstance = useRef<Contract | undefined>(defaultState.ticketsInstance.current);
	const lotteryNameByAddress = useRef<LotteryNameByAddress>(defaultState.lotteryNameByAddress.current);
	const lotteryInstanceByName = useRef<LotteryInstanceByName>(defaultState.lotteryInstanceByName.current);
	const lotteryInstanceByNameReadOnly = useRef<LotteryInstanceByName>(defaultState.lotteryInstanceByNameReadOnly.current);
	const { address, isConnected, isDisconnected, isReconnecting } = useAccount();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();

	useEffect(() => {
		const newConnect = async (isFirstConnection: boolean) => {
			if (!isFirstConnection) dispatch(ticket_reset());
			await onConnected();
		};
		if (isConnected && signer?._isSigner) {
			newConnect(user.address === '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isConnected, signer]);

	useEffect(() => {
		if (user.connected && isDisconnected && !isReconnecting) {
			refReset();
			dispatch(user_disconnected());
			dispatch(ticket_reset());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDisconnected]);

	useEffect(() => {
		const initReadOnlyContract = async () => {
			const netDataLot645 = lot645networks[GLOBAL_SETTINGS.defaultChainId];
			const netDataLot749 = lot749networks[GLOBAL_SETTINGS.defaultChainId];
			const netDataLot420 = lot420networks[GLOBAL_SETTINGS.defaultChainId];

			if (netDataLot645 && netDataLot749 && netDataLot420) {
				lotteryInstanceByNameReadOnly.current[LOTTERY_NAMES.LOTTERY_645] =
					new ethers.Contract(netDataLot645.address, Lottery645.abi, providerEthers);
				lotteryNameByAddress.current[netDataLot645.address] = LOTTERY_NAMES.LOTTERY_645;

				lotteryInstanceByNameReadOnly.current[LOTTERY_NAMES.LOTTERY_749] =
					new ethers.Contract(netDataLot749.address, Lottery749.abi, providerEthers);
				lotteryNameByAddress.current[netDataLot749.address] = LOTTERY_NAMES.LOTTERY_749;

				lotteryInstanceByNameReadOnly.current[LOTTERY_NAMES.LOTTERY_420] =
					new ethers.Contract(netDataLot420.address, Lottery420.abi, providerEthers);
				lotteryNameByAddress.current[netDataLot420.address] = LOTTERY_NAMES.LOTTERY_420;

				for (let key in LOTTERY_NAMES) {
					const name = LOTTERY_NAMES[key];
					const lotteryInstance = lotteryInstanceByNameReadOnly.current[name];
					dispatch(fetchLotteryCurrentId({
						lotteryName: name,
						lotteryInstance: lotteryInstance
					}));
					lotteryInstance.on('NewLotteryStarted', (name, lotteryId) => {
						dispatch(fetchLotteryCurrentId({
							lotteryName: name,
							lotteryInstance: lotteryInstance
						}));
						dispatch(ticket_reset());
					});
				}
			} else console.log('Lotteries contacts were not deployed');
		};

		const initExchangeRate = async () => {
			let price = await getCoinPrices();
			dispatch(update_exchangeRate({
				exchange: {
					MATIC: {
						usd: price['matic-network'].usd,
						rub: price['matic-network'].rub
					},
					ETH: {
						usd: price['ethereum'].usd,
						rub: price['ethereum'].rub
					},
					BNB: {
						usd: price['binancecoin'].usd,
						rub: price['binancecoin'].rub
					}
				}
			}));
		};

		initReadOnlyContract().catch(e => console.log(e));
		initExchangeRate().catch(e => console.log(e));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const refReset = () => {
		lotteryInstanceByName.current = {};
		lotteryNameByAddress.current = {};
		ticketsInstance.current = undefined;
		governanceInstance.current = undefined;
		randomnessInstance.current = undefined;
	};

	const initContracts = async (chainId: number): Promise<boolean> => {
		const netDataLot645 = lot645networks[chainId];
		const netDataLot749 = lot749networks[chainId];
		const netDataLot420 = lot420networks[chainId];
		const netDataTickets = ticketNetworks[chainId];
		const netDataGovernance = govNetworks[chainId];
		const netDataRandomness = randNetworks[chainId];

		if (netDataLot645 &&
			netDataLot749 &&
			netDataLot420 &&
			netDataTickets) {
			try {
				lotteryInstanceByName.current[LOTTERY_NAMES.LOTTERY_645] =
					new ethers.Contract(netDataLot645.address, Lottery645.abi, signer);

				lotteryInstanceByName.current[LOTTERY_NAMES.LOTTERY_749] =
					new ethers.Contract(netDataLot749.address, Lottery749.abi, signer);

				lotteryInstanceByName.current[LOTTERY_NAMES.LOTTERY_420] =
					new ethers.Contract(netDataLot420.address, Lottery420.abi, signer);

				ticketsInstance.current = new ethers.Contract(netDataTickets.address, Tickets.abi, signer);
				governanceInstance.current = new ethers.Contract(netDataGovernance.address, Governance.abi, signer);
				randomnessInstance.current = new ethers.Contract(netDataRandomness.address, Randomness.abi, signer);
			} catch (error) {
				console.log(error);
				await disconnectUser();
				return false;
			}
		} else {
			await disconnectUser();
			history.push('/contract-error');
			return false;
		}
		return true;
	};

	const onConnected = async () => {
		if (chain?.id) {
			if (await initContracts(chain.id)) {
				console.log('here');
				dispatch(user_connected({
					address: address,
					chainId: chain.id,
					chainName: chain.name,
					currency: chain.nativeCurrency.name
				}));
				if (ticketsInstance.current)
					dispatch(fetchUserTickets({
						ticketsInstance: ticketsInstance.current,
						lotteryNameByAddress: lotteryNameByAddress.current,
						lotteryInstanceByName: lotteryInstanceByNameReadOnly.current
					}));
				if (governanceInstance.current)
					dispatch(getAdmin({
						governanceInstance: governanceInstance.current
					}));
			}
		}
	};

	return (
		<Web3Context.Provider value={{
			ticketsInstance: ticketsInstance,
			lotteryNameByAddress: lotteryNameByAddress,
			lotteryInstanceByName: lotteryInstanceByName,
			lotteryInstanceByNameReadOnly: lotteryInstanceByNameReadOnly,
			governanceInstance: governanceInstance,
			randomnessInstance: randomnessInstance
		}}>
			{children}
		</Web3Context.Provider>
	);
};

export default Web3Provider;