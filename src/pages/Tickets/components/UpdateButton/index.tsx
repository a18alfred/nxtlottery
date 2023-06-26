import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReplayIcon from '@mui/icons-material/Replay';
import { secondaryText, text } from '../../../../constants/colors';
import { ticket_reset } from '../../../../state/ticket/slice';
import useLotteryUpdate from '../../../../hooks/useLotteryUpdate';
import { useAppDispatch } from '../../../../state/hooks';

const UpdateIcon = styled(ReplayIcon)`
  color: ${text};
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      color: ${secondaryText};
    }
  }
`;

const UpdateButton = () => {
	const [isActive, setIsActive] = useState(true);
	const dispatch = useAppDispatch();
	const { fetchAllCurrent } = useLotteryUpdate();

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (!isActive) {
			timer = setTimeout(() => {
				setIsActive(true);
			}, 10000);
		}

		return () => clearTimeout(timer);
	}, [isActive]);


	const onUpdate = () => {
		setIsActive(false);
		fetchAllCurrent();
		dispatch(ticket_reset());
	};

	if (!isActive) return null;
	return <UpdateIcon onClick={onUpdate} />;
};

export default UpdateButton;
