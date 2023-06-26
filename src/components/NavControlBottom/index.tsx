import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
	menuBreakerColor, menuModalBottomBgGradient,
	secondaryText,
	text
} from '../../constants/colors';
import { IoTennisballSharp } from 'react-icons/io5';
import { IoMdHome } from 'react-icons/io';
import { TbStack3 } from 'react-icons/tb';
import { IoDice } from 'react-icons/io5';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { bottomNavHeight, bottomNavPadding } from '../../context/theme/style';

const NavControlBottomContainer = styled.nav`
  display: none;

  @media screen and (max-width: 880px) {
    display: flex;
    position: fixed;
    bottom: 0;
    height: ${bottomNavHeight};
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0 ${bottomNavPadding} 0;
    width: 100%;
    background: ${menuModalBottomBgGradient};
    backdrop-filter: blur(8px);
    z-index: 60;
    border-top: 1px solid ${menuBreakerColor};
  }
`;

const NavControlBottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex: 1;
  border-radius: 18px;
  padding: 6px 0;
`;

const activeClassName = 'ACTIVE';

const ControlLink = styled(NavLink).attrs({
	activeClassName
})`
  outline: none;
  cursor: pointer;
  text-decoration: none;
  background: none;
  color: ${secondaryText};
  font-weight: 500;
  font-size: 1.5rem;
  margin: 0;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


  @media (hover: hover) {
    :hover {
      color: ${text};
    }
  }

  &.${activeClassName} {
    color: ${text};
  }
`;

interface ControlLinkCustomProps {
	isActive: boolean;
}

const ControlLinkCustom = styled.button<ControlLinkCustomProps>`
  outline: none;
  cursor: pointer;
  text-decoration: none;
  background: none;
  color: ${({ isActive }) => isActive ? text : secondaryText};
  font-weight: 500;
  font-size: 1.5rem;
  margin: 0;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (hover: hover) {
    :hover {
      color: ${text};
    }
  }
`;

const LabelStyled = styled.div`
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.6rem;
  padding-top: 0.1rem;
`;


const NavControlBottom = () => {
	const { t } = useTranslation();
	const matchTickets = useRouteMatch('/tickets');
	const matchHome = useRouteMatch('/');
	const history = useHistory();

	const onTickets = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (matchTickets?.isExact) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
			return;
		}
		history.push(`/tickets`);
	};

	const onHome = (e: MouseEvent<HTMLButtonElement>) => {
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

	return (
		<NavControlBottomContainer>
			<NavControlBottomWrapper>
				<ControlLinkCustom
					onClick={onHome}
					isActive={!!matchHome?.isExact}
				>
					<IoMdHome style={{ fontSize: 24 }} />
					<LabelStyled>
						{t('home')}
					</LabelStyled>
				</ControlLinkCustom>
				<ControlLink
					to={'/lotteries'}
					isActive={(match, location) => {
						return location.pathname.includes('/lotteries');
					}}
				>
					<IoDice style={{ fontSize: 24 }} />
					<LabelStyled>
						{t('lotteries')}
					</LabelStyled>
				</ControlLink>
				<ControlLinkCustom
					onClick={onTickets}
					isActive={!!matchTickets}
				>
					<TbStack3 style={{ fontSize: 24 }} />
					<LabelStyled>
						{t('my_tickets')}
					</LabelStyled>
				</ControlLinkCustom>
				<ControlLink to={'/results'}>
					<IoTennisballSharp style={{ fontSize: 24 }} />
					<LabelStyled>
						{t('results')}
					</LabelStyled>
				</ControlLink>
			</NavControlBottomWrapper>
		</NavControlBottomContainer>
	);
};

export default NavControlBottom;
