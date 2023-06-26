import React from 'react';
import { RotatingTrianglesLoader } from '../../../../components/Loader';
import { WithChildren } from '../../../../constants/types';
import { Draw } from '../../../../state/lottery/types';

interface SearchLoaderProps extends WithChildren {
	isLoading: boolean;
	draw: Draw;
}

const SearchLoader: React.FC<SearchLoaderProps> = ({ isLoading, draw, children }) => {
	if (isLoading) return (<RotatingTrianglesLoader />);
	if (!draw) return null;
	return (
		<>
			{children}
		</>
	);
};

export default SearchLoader;
