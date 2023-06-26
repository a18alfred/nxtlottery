import React, { useRef, useEffect, Dispatch, RefObject, SetStateAction } from 'react';
import styled from 'styled-components';
import {
	menuBreakerColor,
	menuModalBottomBgGradient
} from '../../constants/colors';
import MenuSelector from './MenuSelector';
import { bottomNavHeight } from '../../context/theme/style';
import { isNode } from '../../utils/helpers';

const MenuContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  position: absolute;
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-height: 460px;
  width: auto;
  overflow: auto;
  background: ${menuModalBottomBgGradient};
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid ${menuBreakerColor};
  font-size: 18px;
  font-weight: 500;
  position: absolute;
  bottom: unset;
  top: 65px;
  right: 0;
  left: unset;
  padding: 1rem 1rem 0.5rem 1rem;
  margin: 0 2rem;
  overflow-x: hidden;
  z-index: 49;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  animation-name: menuUp;
  animation-duration: 0.4s;

  @keyframes menuUp {
    from {
      top: -450px;
    }
    to {
      top: 65px;
    }
  }

  @keyframes menuDown {
    from {
      bottom: -450px;
    }
    to {
      bottom: ${bottomNavHeight};
    }
  }

  @media screen and (max-width: 880px) {
    margin: 0 1rem;
  }

  @media screen and (max-width: 720px) {
    display: flex;
    position: fixed;
    bottom: ${bottomNavHeight};
    left: 0;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem 1rem 1rem;
    width: 100%;
    top: auto;
    right: auto;
    margin: 0;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    border-right: none;
    border-left: none;
    background: ${menuModalBottomBgGradient};
    backdrop-filter: blur(8px);
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
    z-index: 49;


    animation-name: menuDown;
    animation-duration: 0.4s;
  }
`;

const ModalOverlay = styled.div`
  overflow: hidden;
  position: fixed;
  top: 60px;
  right: 0;
  height: 100vh;
  width: 100vw;
  background: transparent;
  z-index: 48;
`;

interface MenuProps {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	buttonRef: RefObject<HTMLButtonElement>;
}

const Menu = ({ setIsOpen, buttonRef }: MenuProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = ({ target }: MouseEvent) => {
			if (isNode(target))
				if (wrapperRef.current &&
					!wrapperRef.current.contains(target) &&
					!buttonRef?.current?.contains(target)) {
					setIsOpen(false);
				}
		};

		const handleScroll = () => {
			setIsOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('scroll', handleScroll);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wrapperRef, buttonRef]);

	return (
		<>
			<ModalOverlay />
			<MenuContainer ref={wrapperRef}>
				<MenuWrapper>
					<MenuSelector setIsOpen={setIsOpen} />
				</MenuWrapper>
			</MenuContainer>
		</>
	);
};

export default Menu;
