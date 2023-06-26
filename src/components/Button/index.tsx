import { MouseEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import {
	backgroundColor, cardBgColor,
	secondaryText,
	text
} from '../../constants/colors';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';

export const AnimateBorder = keyframes`
  0% {
    background-position: 0 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0 50%
  }
`;

interface GlowingBtnProps {
	px?: number;
	py?: number;
}

export const GlowingBtn = styled.button.attrs((props: GlowingBtnProps) => ({
	px: props.px || 0,
	py: props.py || 0
}))`
  display: flex;
  align-items: center;
  padding: ${(props) => props.py}px ${(props) => props.px}px;
  color: ${text};
  font-size: 16px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  border: 2px solid transparent;
  background: ${backgroundColor};
  position: relative;
  z-index: 1;
  border-radius: 24px;

  @media screen and (max-width: 375px) {
    font-size: clamp(0.875rem, 0.5114rem + 1.8182vw, 0.9375rem);
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    background: linear-gradient(90deg, #FF8038 0%, #FF0099 30.43%, #00EBEB 68.23%, #DB00FF 100%);
    background-size: 600% 600%;
    z-index: -1;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: ${AnimateBorder} 4s ease infinite;
    -webkit-animation: ${AnimateBorder} 4s ease infinite;
    -moz-animation: ${AnimateBorder} 4s ease infinite;
    transition: filter 0.1s ease-in;
    border-radius: 24px;
  }

  @media (hover: hover) {
    &:hover {

      &:before {
        filter: blur(4px);
        transition: filter 0.1s ease-in-out;
      }
    }
  }

  &:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${backgroundColor};
    left: 0;
    top: 0;
    border-radius: 24px;
  }
`;

interface BtnWithBorderAndTooltipProps {
	px?: number;
	py?: number;
	radius?: number;
}

export const BtnWithBorderAndTooltip = styled.div.attrs((props: BtnWithBorderAndTooltipProps) => ({
	px: props.px || 0,
	py: props.py || 0,
	radius: props.radius || 24
}))`
  position: relative;
  color: ${secondaryText};
  height: 32px !important;
  width: 32px !important;
  padding: ${(props) => props.py}px ${(props) => props.px}px;
  border-radius: ${(props) => props.radius}px;
  background: transparent;
  outline: none;
  border: 2px solid ${secondaryText};
  cursor: pointer;
  margin-left: 0.5rem !important;

  div {
    display: none;
    position: absolute;
    top: 34px;
    right: 0;
    font-size: 12px;
    color: ${secondaryText};
  }

  @media (hover: hover) {
    :hover {
      color: ${text};
      border: 2px solid ${text};

      div {
        display: block;
      }
    }
  }
`;

export const BtnWrapperWithTooltip = styled.div.attrs((props: GlowingBtnProps) => ({
	px: props.px || 0,
	py: props.py || 0
}))`
  display: flex;
  position: relative;
  color: ${secondaryText};
  cursor: pointer;
  margin-left: 1.5rem !important;

  div {
    display: none;
    position: absolute;
    top: 34px;
    right: 0;
    font-size: 12px;
    color: ${secondaryText};
  }

  @media (hover: hover) {
    :hover {
      color: ${text};

      div {
        display: block;
      }
    }
  }
`;

interface TicketButtonProps {
	maxWidth?: string;
	marginTB?: number;
	bgColor: string;
}


export const TicketButton = styled.button.attrs((props: TicketButtonProps) => ({
	maxWidth: props.maxWidth || '100%',
	marginTB: props.marginTB || 0,
	bgColor: props.bgColor || secondaryText
}))`
  background: ${(props) => props.bgColor};
  text-align: center;
  border-radius: 24px;
  padding: 16px 10px;
  outline: none;
  border: none;
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  color: #FCFCFD;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  margin: ${(props) => props.marginTB} 0;
`;

export const AdminButton = styled.button`
  border-radius: 12px;
  background: ${cardBgColor};
  white-space: nowrap;
  padding: 0.5rem 1rem;
  color: ${text};
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
`;

const ArrowWrapper = styled(ArrowBackIosIcon)`
  color: ${text};
  height: 34px !important;
  width: 34px !important;
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      color: ${secondaryText};
    }
  }
`;

interface BackButtonProps {
	to?: string;
}

export const BackButton = ({ to }: BackButtonProps) => {
	const history = useHistory();

	const onClick = (e: MouseEvent<SVGSVGElement>) => {
		e.preventDefault();
		if (to) history.push(to);
		else history.goBack();
	};

	return (
		<ArrowWrapper onClick={onClick} />
	);
};
