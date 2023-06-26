import React from 'react';
import { ColorRing } from 'react-loader-spinner';

export const RotatingTrianglesLoader = () => {
	return (
		<ColorRing
			visible={true}
			height='80'
			width='80'
			ariaLabel='blocks-loading'
			wrapperStyle={{}}
			wrapperClass='blocks-wrapper'
			colors={['#01AEF4', '#7D52E9', '#FF0DC7', '#FE6279', '#FF9250']}
		/>
	);
};
