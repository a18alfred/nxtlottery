import { createGlobalStyle } from 'styled-components';
import { backgroundColor, text } from '../../constants/colors';
import { isInstalled } from '../pwa/pwa';
import { isMobileSafari } from 'mobile-device-detect';

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${text};
    background-color: ${backgroundColor};
  }
`;
export const bottomNavHeight: string = (isInstalled() && isMobileSafari) ? '78px' : '70px';
export const bottomMarginGeneral: string = (isInstalled() && isMobileSafari) ? '78px' : '70px';
export const bottomMarginHome: string = (isInstalled() && isMobileSafari) ? '108px' : '100px';
export const bottomNavPadding: string = (isInstalled() && isMobileSafari) ? '1.5rem' : '1rem';