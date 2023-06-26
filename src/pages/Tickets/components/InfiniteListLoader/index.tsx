import useInfiniteTicketScroll from '../../../../hooks/useInfiniteTicketScroll';

const InfiniteListLoader = () => {
	const loader = useInfiniteTicketScroll();
	return (<li ref={loader} />);
};

export default InfiniteListLoader;
