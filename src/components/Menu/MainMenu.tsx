import React, { Dispatch, SetStateAction } from 'react';
import AccountInfo from '../AccountInfo';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Brightness3OutlinedIcon from '@mui/icons-material/Brightness3Outlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import { selectIsAdmin } from '../../state/user/slice';
import { useTheme } from '../../context/theme/theme';
import styled, { withTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '../../context/pwa/pwa';
import { useHistory } from 'react-router-dom';
import { secondaryText, text } from '../../constants/colors';
import { useAppSelector } from '../../state/hooks';
import { Theme } from '../../context/theme/types';
import { socialLinks } from '../../constants/socialLinks';

export const MenuControlItem = styled.button`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0.5rem;
  justify-content: space-between;
  color: ${secondaryText};
  text-decoration: none;
  border: none;
  outline: none;
  cursor: pointer;
  background: none;
  font-weight: 500;
  font-size: 18px;

  @media (hover: hover) {
    :hover {
      color: ${text};
    }
  }
`;

const SocialLinksWrapper = styled.div`
  display: flex;
  align-self: center;
  justify-content: space-evenly;
  padding: 1rem 0.5rem;
  width: 100%;

  @media screen and (min-width: 720px) {
    display: none;
  }
`;

export const SocialIconLink = styled.a`
  color: ${secondaryText};
  font-size: 18px;
`;

interface MainMenuProps {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	setIsLanguage: Dispatch<SetStateAction<boolean>>;
	theme: {
		mode: Theme
	};
}

const MainMenu = ({ setIsOpen, setIsLanguage, theme }: MainMenuProps) => {
	const isAdmin = useAppSelector(selectIsAdmin);
	const themeToggle = useTheme();
	const { t } = useTranslation();
	const history = useHistory();
	const pwaValues = usePWAInstall();
	const toInstall = !pwaValues.isInstalled && (pwaValues.promptInstall !== null || pwaValues.isIos);

	const onInstall = () => {
		if (pwaValues.isIos) {
			history.push('/install');
		} else {
			try {
				if (pwaValues.promptInstall) pwaValues.promptInstall.prompt();
			} catch (e) {
				console.log(e);
			}
		}
		setIsOpen(false);
	};

	const onAdmin = () => {
		history.push('/admin');
		setIsOpen(false);
	};

	return (
		<>
			<AccountInfo setIsOpen={setIsOpen} />
			<SocialLinksWrapper>
				{
					socialLinks.map((social, index) => (
						<SocialIconLink
							key={index}
							href={social.href}
							target='_blank'
							area-label={social.name}
						>
							<social.icon />
						</SocialIconLink>
					))
				}
			</SocialLinksWrapper>
			{
				toInstall &&
				<MenuControlItem onClick={onInstall}>
					<div>
						{t('install_app')}
					</div>
					<AppsOutlinedIcon style={{ fontSize: 16, opacity: 0.6, marginTop: 2 }} />
				</MenuControlItem>
			}
			{
				isAdmin
					? <MenuControlItem onClick={onAdmin}>
						<div>{t('admin_panel')}</div>
						<AdminPanelSettingsIcon style={{ fontSize: 18, opacity: 0.8 }} />
					</MenuControlItem>
					: null
			}
			<MenuControlItem onClick={(e) => {
				e.preventDefault();
				setIsLanguage(true);
			}}>
				<div>{t('language')}</div>
				<LanguageOutlinedIcon style={{ fontSize: 18, opacity: 0.8 }} />
			</MenuControlItem>
			{theme.mode === 'dark'
				? <MenuControlItem onClick={() => themeToggle.toggle()}>
					<div>{t('light_theme')}</div>
					<WbSunnyOutlinedIcon style={{ fontSize: 18, opacity: 0.8 }} />
				</MenuControlItem>
				: <MenuControlItem onClick={() => themeToggle.toggle()}>
					<div>{t('dark_theme')}</div>
					<Brightness3OutlinedIcon style={{ fontSize: 18, opacity: 0.8 }} />
				</MenuControlItem>
			}
		</>
	);
};

export default withTheme(MainMenu);
