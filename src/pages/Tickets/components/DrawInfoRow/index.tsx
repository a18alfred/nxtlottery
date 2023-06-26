import React from 'react';
import { AdditionalInfoRow, InfoText } from '../Ticket';
import DrawTimeElement from '../../../../components/DrawTimeElement';
import { useTranslation } from 'react-i18next';
import { Draw } from '../../../../state/lottery/types';

interface DrawInfoRowProps {
	drawData: Draw;
}

const DrawInfoRow = ({ drawData }: DrawInfoRowProps) => {
	const { t } = useTranslation();
	return (
		<AdditionalInfoRow>
			<InfoText>
				{t('draw')} {t('#')}{drawData.id}
			</InfoText>
			<InfoText>
				<DrawTimeElement drawTime={drawData.drawTime} lotteryName={drawData.lotteryName} reFetch={false} />
			</InfoText>
		</AdditionalInfoRow>
	);
};

export default DrawInfoRow;
