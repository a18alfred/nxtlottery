import { memo } from 'react';
import styled from 'styled-components';
import { secondaryText } from '../../constants/colors';
import Identicon from 'identicon.js';

const IdIconImage = styled.img`
  display: flex;
  align-items: center;
  border-radius: 50%;
  height: 17px;
  width: 17px;
  border: solid 1px ${secondaryText};
  margin-right: 0.5rem;
`;

interface IdIconProps {
	address: string;
}

const IdIcon = memo(({ address }: IdIconProps) => {
	return (
		<IdIconImage src={`data:image/png;base64,${new Identicon(address, 30).toString()}`} />
	);
});

export default IdIcon;



