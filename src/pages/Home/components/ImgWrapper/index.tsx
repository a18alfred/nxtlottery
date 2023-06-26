import styled from 'styled-components';

interface ImgWrapperProps {
	height: number;
	width: number;
}

export const ImgWrapper = styled.div<ImgWrapperProps>`
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: ${(props) => `calc(${props.height} / ${props.width} * 100%)`};
`;