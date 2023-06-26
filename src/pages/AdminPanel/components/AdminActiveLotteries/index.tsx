import React from 'react';
import styled from 'styled-components';
import { Row } from '../AdminLotteries';

const AdminActiveLotteriesWrapper = styled.div`
`;

interface AdminActiveLotteriesProps {
	actives: string[];
}

const AdminActiveLotteries = ({ actives }: AdminActiveLotteriesProps) => {
	const listElements = actives.map((lottery, index) => (
		<Row key={index}>
			{index + 1}. {lottery}
		</Row>
	));

	return (
		<AdminActiveLotteriesWrapper>
			{listElements}
		</AdminActiveLotteriesWrapper>
	);
};

export default AdminActiveLotteries;