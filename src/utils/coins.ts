import { CoinGeckoClient } from 'coingecko-api-v3-axios';
import { SimplePriceResponse } from 'coingecko-api-v3-axios/dist/Inteface';

const coinGeckoClient = new CoinGeckoClient({
	timeout: 10000,
	autoRetry: true
});

export const getCoinPrices = async (): Promise<SimplePriceResponse> => {
	try {
		return await coinGeckoClient.simplePrice({
			ids: 'matic-network,ethereum,binancecoin',
			vs_currencies: 'usd,rub'
		});
	} catch (error) {
		throw error;
	}
};