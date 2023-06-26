import theme from 'styled-theming';
import { LotterySpecificColor } from './types';

export const backgroundColor = theme('mode', {
	light: '#FFFFFF',
	dark: '#141416'
});

export const backgroundColorManual = {
	light: '#FDFDFDFF',
	dark: '#141416'
};

export const text = theme('mode', {
	light: '#26252D',
	dark: '#FCFCFD'
});

export const textInverted = theme('mode', {
	light: '#FCFCFD',
	dark: '#26252D'
});

export const secondaryText = theme('mode', {
	light: '#797E8E',
	dark: '#747B8D'
});

export const cardBgColor = theme('mode', {
	light: '#F3F5F6',
	dark: '#1B1D23'
});

export const menuBreakerColor = theme('mode', {
	light: 'rgba(117, 124, 142, 0.15)',
	dark: 'rgba(117, 124, 142, 0.09)'
});

export const lotteryColorBtn: LotterySpecificColor = {
	'lottery645': 'linear-gradient(to right, #ff5c7e, #ff6567, #ff734e, #ff8632, #ff9a04)',
	'lottery749': 'linear-gradient(to right, #1d21e6, #0053f7, #0074fe, #008ffc, #08a8f5)',
	'lottery420': 'linear-gradient(to right, #675eff, #8856ff, #a749ff, #c436ff, #e006ff)'
};

export const lotteryNumbersBg: LotterySpecificColor = {
	'lottery645': '#FF9908',
	'lottery749': '#099EF5',
	'lottery420': '#DE07FF'
};
export const lotteryNumbersHoverBg: LotterySpecificColor = {
	'lottery645': '#FF5E6B',
	'lottery749': '#1B2AE6',
	'lottery420': '#7158FF'
};

export const headerNavHover = theme('mode', {
	light: 'linear-gradient(to right, #ffffff, #ece1ff, #dfc1ff, #da9eff, #d975ff, #d975ff, #d975ff, #d975ff, #da9eff, #dfc1ff, #ece1ff, #ffffff)',
	dark: 'linear-gradient(to right, #141416, #242344, #3b3074, #5f38a3, #8f37ce, #8f37ce, #8f37ce, #8f37ce, #5f38a3, #3b3074, #242344, #141416)'
});

export const menuModalBottomBgGradient = theme('mode', {
	light: 'rgba(255,255,255,0.8)',
	dark: 'rgba(20,20,22,0.8)'
});