import { useEffect, useRef } from 'react';
import { useTicketFetch } from './useTicketFetch';
import { selectTicketHasMore, selectTicketLoadingState } from '../state/ticket/slice';
import { useAppSelector } from '../state/hooks';

const useInfiniteTicketScroll = () => {
	const { fetchTickets } = useTicketFetch();
	const isLoading = useAppSelector(selectTicketLoadingState);
	const hasMore = useAppSelector(selectTicketHasMore);
	const loader = useRef<HTMLLIElement>(null);

	useEffect(() => {
		const handleObserver = async (entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (!isLoading && hasMore && target.isIntersecting) {
				await fetchTickets();
			}
		};

		const observer = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: '1000px',
			threshold: 0
		});

		if (loader.current) {
			observer.observe(loader.current);
		}

		return () => {
			observer.disconnect();
		};

	}, [hasMore, isLoading, fetchTickets]);

	return loader;
};

export default useInfiniteTicketScroll;
