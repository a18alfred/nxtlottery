import React, { useState, useRef, MouseEvent } from 'react';
import { selectUserAddress, selectUserConnectionStatus, user_loading } from '../../state/user/slice';
import styled from 'styled-components';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { truncate } from '../../utils/helpers';
import Menu from '../Menu';
import {
	text,
	backgroundColor, menuBreakerColor, secondaryText
} from '../../constants/colors';
import NavControlBottom from '../NavControlBottom';
import { GlowingBtn } from '../Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NavControlTop from '../NavControlTop';
import { useWeb3Modal } from '@web3modal/react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import IdIcon from '../IdIcon';

const HeaderElement = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 55;
  border-bottom: 1px solid ${menuBreakerColor};
`;

const HeaderWrap = styled.div`
  background: ${backgroundColor};
  // backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  z-index: 55;

  @media screen and (max-width: 880px) {
    padding: 0 1rem;
  }
`;

const HeaderLeft = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 800;
  cursor: pointer;

  &::before {
    position: absolute;
    bottom: 12px;
    content: "TESTNET BETA";
    font-size: 8px;
    color: ${secondaryText};
    margin-right: 5px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TopControls = styled.nav`
  justify-content: center;
  flex: 1;

  @media screen and (max-width: 880px) {
    display: none;
  }
`;

const MenuMoreIconUp = styled(KeyboardArrowUpIcon)`
  position: relative;
  color: ${text};
  height: 33px !important;
  width: 33px !important;
  border-radius: 50%;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  margin-left: 0.5rem !important;
`;

const MenuMoreIconDown = styled(KeyboardArrowDownIcon)`
  position: relative;
  color: ${text};
  height: 33px !important;
  width: 33px !important;
  border-radius: 50%;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  margin-left: 0.5rem !important;
`;

const HeaderSpacer = styled.div`
  width: 100%;
  height: 60px;
`;

const Header = () => {
	const { open } = useWeb3Modal();
	const dispatch = useAppDispatch();
	const connected = useAppSelector(selectUserConnectionStatus);
	const address = useAppSelector(selectUserAddress);
	const history = useHistory();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { t } = useTranslation();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const matchHome = useRouteMatch('/');

	const toggleMore = (e: MouseEvent<SVGSVGElement> | MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsOpen(prev => !prev);
	};

	const onTickets = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (matchHome?.isExact) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
			return;
		}
		history.push(`/`);
	};


	const onConnect = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!connected) {
			dispatch(user_loading());
			open();
		}
	};

	return (
		<>
			<HeaderElement>
				<HeaderWrap>
					<HeaderLeft onClick={onTickets}>
						NXTLOTTERY
					</HeaderLeft>
					<TopControls>
						<NavControlTop />
					</TopControls>
					<HeaderRight>
						{
							connected ?
								<GlowingBtn ref={buttonRef} px={7} py={7} onClick={toggleMore}>
									<IdIcon address={address} />
									{truncate(address, 13)}
									{isOpen ? <MenuMoreIconUp style={{ margin: -7 }} />
										: <MenuMoreIconDown style={{ margin: -7 }} />}
								</GlowingBtn>
								: <>
									<GlowingBtn px={7} py={7} onClick={onConnect}>
										{t('connect_to_a_wallet')}
									</GlowingBtn>
									{isOpen ? <MenuMoreIconUp style={{ margin: -7 }} />
										: <MenuMoreIconDown onClick={toggleMore} style={{ margin: -7 }} />}
								</>
						}

					</HeaderRight>
				</HeaderWrap>
				{
					isOpen &&
					<Menu
						setIsOpen={setIsOpen}
						buttonRef={buttonRef}
					/>
				}
			</HeaderElement>
			<HeaderSpacer />
			<NavControlBottom />
		</>
	);
};

export default Header;
