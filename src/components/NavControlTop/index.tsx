import { useTranslation } from 'react-i18next';
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { headerNavHover, text } from '../../constants/colors';

const NavControlTopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 6px 0;
  margin-left: 2rem;
`;

const activeClassName = 'ACTIVE';

const ControlLink = styled(NavLink).attrs({
	activeClassName
})`
  display: inline-block;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${text};
  font-weight: 500;
  padding: 0.2rem 0;
  font-size: 1rem;
  margin: 0 6px;

  background-image: ${headerNavHover};
  background-size: 0 2px;
  background-repeat: no-repeat;
  transition: background-size 0.3s;
  background-position: 50% 100%;

  @media (hover: hover) {
    :hover {
      background-size: 100% 2px;
    }
  }

  &.${activeClassName} {
    background-size: 100% 2px;
  }
`;

const NavControlTop = () => {
	const { t } = useTranslation();

	return (
		<NavControlTopContainer>
			<ControlLink exact to={'/'}>
				{t('home')}
			</ControlLink>
			<ControlLink to={'/lotteries'}
						 isActive={(match, location) => {
							 return location.pathname.includes('/lotteries');
						 }}
			>
				{t('lotteries')}
			</ControlLink>
			<ControlLink
				to={'/tickets'}
				isActive={(match, location) => {
					return location.pathname.includes('/tickets');
				}}
			>
				{t('my_tickets')}
			</ControlLink>
			<ControlLink to={'/results'}>
				{t('results')}
			</ControlLink>

		</NavControlTopContainer>
	);
};

export default NavControlTop;